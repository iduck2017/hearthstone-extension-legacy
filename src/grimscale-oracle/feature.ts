import { AttackModel, FeatureModel, MinionModel, RaceType, RoleModel } from "hearthstone-core";
import { DebugUtil, LogLevel, StateUtil, StoreUtil, TranxUtil } from "set-piece";
import { DeepReadonly } from "utility-types";

export namespace GrimscaleOracleFeatureModel {
    export type Event = {}
    export type State = {
        offset: number;
    }
}

@StoreUtil.is('grimscale-oracle-feature')
export class GrimscaleOracleFeatureModel extends FeatureModel<
    GrimscaleOracleFeatureModel.Event,
    GrimscaleOracleFeatureModel.State
> {
    constructor(props: GrimscaleOracleFeatureModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Grimscale Oracle\'s Aura',
                desc: 'Your other Murlocs have +1 Attack.',
                offset: 1,
                status: 1,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        });
    }


    @StateUtil.on(self => {
        const proxy = self.route.player?.proxy;
        if (!proxy) return;
        const board = proxy.child.board;
        const minions = board.child.cards.child.minion;
        if (!minions) return;
        return minions.child.attack.decor;
    })
    @DebugUtil.log(LogLevel.WARN)
    private onCheck(
        that: AttackModel, 
        state: DeepReadonly<AttackModel.State>
    ) {
        if (!this.route.board) return state;
        if (!this.state.status) return state;
        const card = that.route.card;
        const minion = that.route.minion;
        if (!minion) return state;
        if (this.route.role === minion) return state;
        if (!minion.state.races.includes(RaceType.MURLOC)) return state;
        const result = { ...state };
        result.offset = state.offset + this.state.offset;
        return result;
    }

}