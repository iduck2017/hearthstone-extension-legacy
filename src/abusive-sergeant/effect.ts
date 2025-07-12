import { EffectModel, GameModel } from "hearthstone-core";
import { DebugUtil, EventUtil, LogLevel, TranxUtil } from "set-piece";

export class AbusiveSergeantEffectModel extends EffectModel {
    constructor(props: AbusiveSergeantEffectModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant\'s Buff',
                desc: '+2 Attack this turn.',
                modAttack: 2,
                modHealth: 0,
                isEnable: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.use(self => self.route.game?.proxy.event.onTurnEnd)
    @DebugUtil.log(LogLevel.WARN)
    @TranxUtil.use()
    private handleTurnEnd(that: GameModel) {
        this.draft.state.isActive = false;
        this.reload();
    }
}
