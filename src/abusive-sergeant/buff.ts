import { GameModel, IRoleBuffModel, RoleModel, TurnModel } from "hearthstone-core";
import { DebugUtil, Event, EventUtil, Loader, LogLevel, StoreUtil, TranxUtil } from "set-piece";

@StoreUtil.is('abusive-sergeant-buff')
export class AbusiveSergeantBuffModel extends IRoleBuffModel {
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
