import { AttackModel, BoardModel, FeatureModel, MinionModel, RoleModel } from "hearthstone-core";
import { DebugUtil, Event, EventUtil, LogLevel, StateUtil, StoreUtil, TranxUtil } from "set-piece";
import { DeepReadonly } from "utility-types";

export namespace DireWolfAlphaFeatureModel {
    export type Event = {}
    export type State = {
        offset: number;
    }
}

@StoreUtil.is('dire-wolf-alpha-feature')
export class DireWolfAlphaFeatureModel extends FeatureModel<
    DireWolfAlphaFeatureModel.Event,
    DireWolfAlphaFeatureModel.State
> {
    constructor(props: DireWolfAlphaFeatureModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Dire Wolf Alpha\'s Aura',
                desc: 'Adjacent minions have +1 Attack.',
                offset: 1,
                status: 1,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        });
    }

    @EventUtil.on(self => {
        const proxy = self.route.player?.proxy;
        if (!proxy) return;
        const board = proxy.child.board;
        return board.event.onChildChange;
    })
    private onChildChange(that: BoardModel, state: Event.OnChildChange<BoardModel>) {
        if (!this.route.board) return;
        this.reload();
    }

    // Provide +1 Attack to all friendly minions
    @DebugUtil.log(LogLevel.WARN)
    @StateUtil.on(self => {
        const player = self.route.player;
        const board = player?.proxy.child.board;
        const minion = board?.child.cards.child.minion;
        return minion?.child.attack.decor;
    })
    private onCheck(
        that: AttackModel, 
        state: DeepReadonly<AttackModel.State>
    ) {
        const board = this.route.board;
        if (!board) return state;
        if (!this.state.status) return state;
        const cardA = this.route.card;
        const cardB = that.route.card;
        if (!cardA) return state;
        if (!cardB) return state;
        const indexA = board.child.cards.indexOf(cardA);
        const indexB = board.child.cards.indexOf(cardB);
        console.log(indexA, indexB);
        const distance = Math.abs(indexA - indexB);
        if (distance !== 1) return state;
        // Apply +1 Attack to all friendly minions
        const result = { ...state };
        result.offset = state.offset + this.state.offset;
        return result;
    }
} 