import { BuffModel, GameModel, RoleModel, TurnModel } from "hearthstone-core";
import { CardModel } from "hearthstone-core/dist/type/models/cards";
import { DebugUtil, Event, EventUtil, Loader, LogLevel, StoreUtil, TranxUtil } from "set-piece";

@StoreUtil.is('abusive-sergeant-buff')
export class AbusiveSergeantBuffModel extends BuffModel {
    constructor(loader?: Loader<AbusiveSergeantBuffModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Abusive Sergeant\'s Buff',
                    desc: '+2 Attack this turn.',
                    offsetAttack: 2,
                    offsetHealth: 0,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    @EventUtil.on(self => self.route.game?.proxy.child.turn.event.onEnd)
    @DebugUtil.log(LogLevel.WARN)
    @TranxUtil.span()
    private onTurnEnd(that: TurnModel, event: Event) {
        this.disable();
    }
}
