import { IRoleBuffModel, GameModel, RoleModel, TurnModel } from "hearthstone-core";
import { DebugUtil, Event, EventUtil, TemplUtil, TranxUtil } from "set-piece";

@TemplUtil.is('mana-wyrm-buff')
export class ManaWyrmBuffModel extends IRoleBuffModel {
    constructor(props?: ManaWyrmBuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Mana Wyrm\'s Buff',
                desc: '+1 Attack.',
                offset: [1, 0],
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}
