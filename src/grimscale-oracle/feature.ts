import { RoleAttackModel, FeatureModel, MinionCardModel, RaceType, RoleModel, OperationType, RoleAttackDecor } from "hearthstone-core";
import { DebugUtil, StateUtil, TemplUtil, TranxUtil, Decor } from "set-piece";

export namespace GrimscaleOracleFeatureModel {
    export type E = {}
    export type S = {
        offset: number;
    }
    export type C = {}
    export type R = {}
}

@TemplUtil.is('grimscale-oracle-feature')
export class GrimscaleOracleFeatureModel extends FeatureModel<
    GrimscaleOracleFeatureModel.E,
    GrimscaleOracleFeatureModel.S,
    GrimscaleOracleFeatureModel.C,
    GrimscaleOracleFeatureModel.R
> {
    public get route() {
        const result = super.route;
        const role = result.list.find(item => item instanceof RoleModel);
        return {
            ...result,
            role
        };
    }

    constructor(props?: GrimscaleOracleFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Grimscale Oracle\'s Aura',
                desc: 'Your other Murlocs have +1 Attack.',
                offset: 1,
                isActive: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @StateUtil.on(self => self.modifyAttack)
    private listenAttack() {
        return this.route.player?.proxy.child.board.child.minions.child.role.child.attack.decor
    }
    private modifyAttack(that: RoleAttackModel, decor: RoleAttackDecor) {
        if (!this.route.board) return;
        if (!this.state.isActive) return;
        
        const minion = that.route.minion;
        if (!minion) return;
        const role = minion.child.role;
        if (this.route.role === role) return;

        if (!minion.state.races.includes(RaceType.MURLOC)) return;
        decor.add({
            value: this.state.offset,
            type: OperationType.ADD,
            reason: this,
        })
    }
}