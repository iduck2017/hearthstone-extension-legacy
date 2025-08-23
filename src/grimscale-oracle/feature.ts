import { AttackModel, FeatureModel, RaceType, RoleModel } from "hearthstone-core";
import { DebugUtil, LogLevel, StateUtil, TranxUtil } from "set-piece";
import { DeepReadonly } from "utility-types";

export namespace GrimscaleOracleFeatureModel {
    export type Event = {}
    export type State = {
        offset: number;
    }
}

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


    @StateUtil.on(self => self.route.player?.proxy.child.board.child.cards.child.role.child.attack.decor)
    @DebugUtil.log(LogLevel.WARN)
    private onCheck(
        that: AttackModel, 
        state: DeepReadonly<AttackModel.State>
    ) {
        if (!this.route.board) return state;
        if (!this.state.status) return state;
        const card = that.route.card;
        const role = that.route.role;
        if (this.route.role === role) return state;
        if (!card?.state.races.includes(RaceType.MURLOC)) return state;
        return {
            ...state,
            offset: state.offset + this.state.offset,
        }
    }

}