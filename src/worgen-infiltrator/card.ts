import { MinionCardModel } from "hearthstone-core";
import { WorgenInfiltratorRoleModel } from "./role";

export class WorgenInfiltratorCardModel extends MinionCardModel {
    constructor(props: WorgenInfiltratorCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Worgen Infiltrator',
                desc: 'Stealth',
                mana: 1,
                races: [],
                ...props.state,
            },
            child: {
                role: new WorgenInfiltratorRoleModel({}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}