import { MinionCardModel, RaceType } from "hearthstone-core";
import { StoreUtil } from "set-piece";
import { WispRoleModel } from "./role";

@StoreUtil.is('wisp-card')
export class WispCardModel extends MinionCardModel {
    constructor(props: WispCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Wisp',
                desc: '',
                mana: 0,
                races: [RaceType.UNDEAD],
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
