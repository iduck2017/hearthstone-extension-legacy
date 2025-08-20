import { CardModel, MinionCardModel } from "hearthstone-core";
import { ArgentSquireRoleModel } from "./role";

export class ArgentSquireCardModel extends MinionCardModel {
    public constructor(props: CardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Argent Squire',
                desc: 'Divine Shield',
                mana: 1,
                races: [],
                ...props.state,
            },
            child: {
                role: new ArgentSquireRoleModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}