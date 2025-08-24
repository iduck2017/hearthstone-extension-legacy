import { BuffModel } from "hearthstone-core";
import { StoreUtil } from "set-piece";

@StoreUtil.is('lightwarden-buff')
export class LightwardenBuffModel extends BuffModel {
    constructor(props: LightwardenBuffModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Lightwarden\'s Buff',
                desc: '+2 Attack',
                attack: 2,
                health: 0,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}