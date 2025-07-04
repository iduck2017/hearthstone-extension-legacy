import { MinionCardModel } from "hearthstone-core";
import { WispRoleModel } from "./role";
import { StoreService } from "set-piece";

@StoreService.is('wisp-card')
export class WispCardModel extends MinionCardModel {
    constructor(props: WispCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Wisp',
                desc: '',
                mana: 0,
                ...props.state,
            },
            child: { 
                role: new WispRoleModel({}),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }

}
