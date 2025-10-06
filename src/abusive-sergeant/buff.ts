import { GameModel, RoleBuffModel, RoleModel, TurnModel } from "hearthstone-core";
import { CardModel } from "hearthstone-core/dist/type/models/cards";
import { DebugUtil, Event, EventUtil, Loader, LogLevel, StoreUtil, TranxUtil } from "set-piece";

@StoreUtil.is('abusive-sergeant-buff')
export class AbusiveSergeantBuffModel extends RoleBuffModel {
    constructor(loader?: Loader<AbusiveSergeantBuffModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Abusive Sergeant\'s Buff',
                    desc: '+2 Attack this turn.',
                    offset: [2, 0],
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    @EventUtil.on(self => self.route.game?.proxy.child.turn.event.onEnd)
    private onTurnEnd(that: TurnModel, event: Event) {
        this.deactive();
    }   
}
