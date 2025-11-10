import { RoleAttackModel, FeatureModel, MinionCardModel, RaceType, RoleModel, OperatorType, RoleAttackDecor, CardFeatureModel, MinionFeatureModel } from "hearthstone-core";
import { DebugUtil, StateUtil, TemplUtil, TranxUtil, Decor } from "set-piece";

export namespace GrimscaleOracleFeatureModel {
    export type E = {}
    export type S = { offset: number; }
    export type C = {}
    export type R = {}
}

@TemplUtil.is('grimscale-oracle-feature')
export class GrimscaleOracleFeatureModel extends MinionFeatureModel<
    GrimscaleOracleFeatureModel.E,
    GrimscaleOracleFeatureModel.S,
    GrimscaleOracleFeatureModel.C,
    GrimscaleOracleFeatureModel.R
> {
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
        return this.route.player?.proxy.child.board.any(MinionCardModel).child.attack.decor
    }
    private modifyAttack(that: RoleAttackModel, decor: RoleAttackDecor) {
        if (!this.state.isActive) return;
        
        const minion = that.route.minion;
        if (!minion) return;
        if (this.route.minion === minion) return;

        if (!minion.state.races.includes(RaceType.MURLOC)) return;
        decor.add({
            offset: this.state.offset,
            type: OperatorType.ADD,
            reason: this,
        })
    }
}