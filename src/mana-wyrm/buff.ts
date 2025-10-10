import { IRoleBuffModel, GameModel, RoleModel, TurnModel } from "hearthstone-core";
import { DebugUtil, Event, EventUtil, Loader, LogLevel, TemplUtil, TranxUtil } from "set-piece";

@TemplUtil.is('mana-wyrm-buff')
export class ManaWyrmBuffModel extends IRoleBuffModel {
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
