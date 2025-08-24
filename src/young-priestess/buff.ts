// Young Priestess Buff - +1 Health

import { BuffModel } from "hearthstone-core";
import { StoreUtil } from "set-piece";

@StoreUtil.is('young-priestess-buff')
export class YoungPriestessBuffModel extends BuffModel {
    constructor(props: YoungPriestessBuffModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Young Priestess\'s Buff',
                desc: '+1 Health',
                attack: 0,
                health: 1,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        });
    }
} 