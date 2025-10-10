import { RoleAttackModel, FeatureModel, RoleHealthModel, RoleAttackDecor, OperationType, RoleModel } from "hearthstone-core";
import { Event, EventUtil, StateUtil, TemplUtil, TranxUtil, Decor, Frame } from "set-piece";

export namespace AmaniBerserkerFeatureProps {
    export type E = {};
    export type S = {
        offset: number,
    };
    export type C = {};
    export type R = {}
}

@TemplUtil.is('amani-berserker-feature')
export class AmaniBerserkerFeatureModel extends FeatureModel<
    AmaniBerserkerFeatureProps.E,
    AmaniBerserkerFeatureProps.S,
    AmaniBerserkerFeatureProps.C,
    AmaniBerserkerFeatureProps.R
> {
    public get route() {
        const result = super.route;
        const role = result.list.find(item => item instanceof RoleModel);
        return {
            ...result,
            role
        };
    }

    constructor(props?: AmaniBerserkerFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Amani Berserker\'s Buff',
                desc: 'Has +3 Attack while damaged.',
                offset: 3,
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleChange)
    private listenChange() {
        return this.route.role?.proxy.child.health.event?.onChange
    }

    // Listen to health state changes to trigger enrage effect
    @TranxUtil.span()
    private handleChange(that: RoleHealthModel, event: { prev: Frame<RoleHealthModel> }) {
        if (that.state.current !== event.prev.state.current) this.reload()
        if (that.state.maximum !== event.prev.state.maximum) this.reload()
    }

    @StateUtil.on(self => self.handleAttack)
    private listenAttack() {
        return this.route.role?.proxy.child.attack.decor
    }

    // Apply attack buff when damaged
    private handleAttack(
        that: RoleAttackModel,
        decor: RoleAttackDecor
    ) {
        const role = that.route.role;
        if (!role) return;

        const health = role.child.health;
        const isEnrage = health.state.current < health.state.maximum;
        if (!isEnrage) return;
        
        decor.add({
            value: this.state.offset,
            type: OperationType.ADD,
            reason: this,
        })
    }
} 