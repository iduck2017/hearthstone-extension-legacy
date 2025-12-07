import { FeatureModel, RoleAttackModel, RoleAttackDecor, OperatorType, RoleModel, RoleHealthModel, RoleFeatureModel } from "hearthstone-core";
import { EventPlugin, ChunkService, StatePlugin, TranxService, Frame, Event } from "set-piece";

export namespace TaurenWarriorFeatureModel {
    export type E = {}
    export type S = { offset: number }
    export type C = {}
    export type R = {}
}

@ChunkService.is('tauren-warrior-feature')
export class TaurenWarriorFeatureModel extends RoleFeatureModel<
    TaurenWarriorFeatureModel.E,
    TaurenWarriorFeatureModel.S,
    TaurenWarriorFeatureModel.C,
    TaurenWarriorFeatureModel.R
> {
    constructor(props?: TaurenWarriorFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Tauren Warrior's Buff",
                desc: "Has +3 Attack while damaged.",
                offset: 3,
                isEnabled: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // Listen to health state changes to trigger enrage effect
    @EventPlugin.on(self => self.handleChange)
    private listenChange() {
        return this.route.role?.proxy.child.health.event?.onChange
    }
    @TranxService.span()
    private handleChange(that: RoleHealthModel, event: Event<Frame<RoleHealthModel>>) {
        if (that.state.current !== event.detail.state.current) this.reload()
        if (that.state.maximum !== event.detail.state.maximum) this.reload()
    }


    // Apply attack buff when damaged
    @StatePlugin.on(self => self.modifyAttack)
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
        const isEnrage = health.state.isInjured;
        if (!isEnrage) return;
        
        decor.add({
            type: OperatorType.ADD,
            offset: this.state.offset,
            method: this,
        })
    }
}
