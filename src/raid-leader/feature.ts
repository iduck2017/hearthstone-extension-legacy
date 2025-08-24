import { AttackModel, FeatureModel, MinionModel, RaceType, RoleModel } from "hearthstone-core";
import { DebugUtil, LogLevel, StateUtil, StoreUtil, TranxUtil } from "set-piece";
import { DeepReadonly } from "utility-types";

export namespace RaidLeaderFeatureModel {
    export type Event = {}
    export type State = {
        offset: number;
    }
}

@StoreUtil.is('raid-leader-feature')
export class RaidLeaderFeatureModel extends FeatureModel<
    RaidLeaderFeatureModel.Event,
    RaidLeaderFeatureModel.State
> {
    constructor(props: RaidLeaderFeatureModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Raid Leader\'s Aura',
                desc: 'Your other minions have +1 Attack.',
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
        const self = that.route.minion;
        if (!self) return state;
        if (this.route.role === self) return state;
        // No race restriction - affects all other minions
        const result = { ...state };
        result.offset = state.offset + this.state.offset;
        return result;
    }
} 