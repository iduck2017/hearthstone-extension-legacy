import { RoleBuffModel, GameModel, RoleModel, TurnModel } from "hearthstone-core";
import { CardModel } from "hearthstone-core/dist/type/models/cards";
import { DebugUtil, Event, EventUtil, Loader, LogLevel, StoreUtil, TranxUtil } from "set-piece";

@StoreUtil.is('mana-wyrm-buff')
export class ManaWyrmBuffModel extends RoleBuffModel {
    constructor(loader?: Loader<ManaWyrmBuffModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Mana Wyrm\'s Buff',
                    desc: '+1 Attack.',
                    offset: [1, 0],
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }
}
