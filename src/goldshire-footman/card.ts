import { MinionCardModel } from "hearthstone-core";
import { GoldshireFootmanRoleModel } from "./role";

export class GoldshireFootmanCardModel extends MinionCardModel {
    constructor(props: GoldshireFootmanCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Goldshire Footman',
                desc: 'Taunt',
                mana: 1,
                ...props.state
            },
            child: {
                role: new GoldshireFootmanRoleModel({}),
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }
}