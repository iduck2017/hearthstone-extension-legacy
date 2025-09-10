import { RoleAttackModel, FeatureModel, MinionCardModel, RaceType, RoleModel, RoleAttackProps } from "hearthstone-core";
import { DebugUtil, LogLevel, StateUtil, StoreUtil, TranxUtil, Loader, Decor } from "set-piece";
import { DeepReadonly } from "utility-types";

export namespace GrimscaleOracleFeatureModel {
    export type Event = {}
    export type State = {
        offsetAttack: number;
    }
    export type Child = {}
    export type Refer = {}
}

@StoreUtil.is('grimscale-oracle-feature')
export class GrimscaleOracleFeatureModel extends FeatureModel<
    GrimscaleOracleFeatureModel.Event,
    GrimscaleOracleFeatureModel.State,
    GrimscaleOracleFeatureModel.Child,
    GrimscaleOracleFeatureModel.Refer
> {
    constructor(loader?: Loader<GrimscaleOracleFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Grimscale Oracle\'s Aura',
                    desc: 'Your other Murlocs have +1 Attack.',
                    offsetAttack: 1,
                    isActive: true,
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer }
            }
        });
    }

    @StateUtil.on(self => self.route.player?.proxy.child.board.child.minions.child.role.child.attack.decor)
    @DebugUtil.log(LogLevel.WARN)
    private onCheck(
        that: RoleAttackModel, 
        state: Decor<RoleAttackProps.S>
    ) {
        if (!this.route.board) return;
        if (!this.state.isActive) return;
        
        const minion = that.route.minion;
        if (!minion) return;
        const role = minion.child.role;
        if (this.route.role === role) return;

        if (!minion.state.races.includes(RaceType.MURLOC)) return;
        state.current.offset += this.state.offsetAttack;
    }
}