import { FeatureModel, RoleAttackModel, RoleAttackDecor, OperatorType, RoleModel, RoleHealthModel } from "hearthstone-core";
import { EventUtil, TemplUtil, StateUtil, TranxUtil, Frame, Event } from "set-piece";

export namespace TaurenWarriorFeatureModel {
    export type E = {}
    export type S = { offset: number }
    export type C = {}
    export type R = {}
}

@TemplUtil.is('tauren-warrior-feature')
export class TaurenWarriorFeatureModel extends FeatureModel<
    TaurenWarriorFeatureModel.E,
    TaurenWarriorFeatureModel.S,
    TaurenWarriorFeatureModel.C,
    TaurenWarriorFeatureModel.R
> {
    public get route() {
        const result = super.route;
        const role: RoleModel | undefined = result.list.find(item => item instanceof RoleModel);
        return {
            ...result,
            role
        };
    }

    constructor(props?: TaurenWarriorFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                isBoard: true,
                name: "Tauren Warrior's Buff",
                desc: "Has +3 Attack while damaged.",
                offset: 3,
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // Listen to health state changes to trigger enrage effect
    @EventUtil.on(self => self.handleChange)
    private listenChange() {
        return this.route.role?.proxy.child.health.event?.onChange
    }
    @TranxUtil.span()
    private handleChange(that: RoleHealthModel, event: Event<Frame<RoleHealthModel>>) {
        if (that.state.current !== event.detail.state.current) this.reload()
        if (that.state.maximum !== event.detail.state.maximum) this.reload()
    }


    // Apply attack buff when damaged
    @StateUtil.on(self => self.modifyAttack)
    private listenAttack() {
        return this.route.role?.proxy.child.attack.decor
    }
    private modifyAttack(
        that: RoleAttackModel,
        decor: RoleAttackDecor
    ) {
        const role = that.route.role;
        if (!role) return;

        const health = role.child.health;
        const isEnrage = health.state.current < health.state.maximum;
        if (!isEnrage) return;
        
        decor.add({
            type: OperatorType.ADD,
            offset: this.state.offset,
            reason: this,
        })
    }
}
