import { BuffModel, GameModel, TurnModel } from "hearthstone-core";
import { DebugUtil, EventUtil, LogLevel, TranxUtil } from "set-piece";

export class AbusiveSergeantBuffModel extends BuffModel {
    constructor(props: AbusiveSergeantBuffModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant\'s Buff',
                desc: '+2 Attack this turn.',
                attack: 2,
                health: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.route.game?.proxy.child.turn.event.onEnd)
    @DebugUtil.log(LogLevel.WARN)
    @TranxUtil.span()
    private onTurnEnd(that: TurnModel, event: {}) {
        this.disable();
    }
}
