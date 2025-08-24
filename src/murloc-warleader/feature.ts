import { AttackModel, FeatureModel, MinionModel, RaceType, RoleModel } from "hearthstone-core";
import { DebugUtil, LogLevel, StateUtil, StoreUtil, TranxUtil } from "set-piece";
import { DeepReadonly } from "utility-types";

export namespace MurlocWarleaderFeatureModel {
    export type Event = {}
    export type State = {
        offset: number;
    }
}

@StoreUtil.is('murloc-warleader-feature')
export class MurlocWarleaderFeatureModel extends FeatureModel<
    MurlocWarleaderFeatureModel.Event,
    MurlocWarleaderFeatureModel.State
> {
    constructor(props: MurlocWarleaderFeatureModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Warleader\'s Aura',
                desc: 'Your other Murlocs have +2 Attack.',
                offset: 2,
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
        if (!self.state.races.includes(RaceType.MURLOC)) return state;
        const result = { ...state };
        result.offset = state.offset + this.state.offset;
        return result;
    }
} 