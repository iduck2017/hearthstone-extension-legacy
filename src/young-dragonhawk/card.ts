import { MinionCardModel, RaceType } from "hearthstone-core";
import { YoungDragonhawkRoleModel } from "./role";

export class YoungDragonhawkCardModel extends MinionCardModel {
    constructor(props: YoungDragonhawkCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Young Dragonhawk',
                desc: 'Windfury',
                mana: 1,
                races: [RaceType.BEAST],
                ...props.state,
            },
            child: {
                role: new YoungDragonhawkRoleModel({}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}