import { MinionCardModel, RaceType } from "hearthstone-core";
import { ShieldbearerRoleModel } from "./role";

export class ShieldbearerCardModel extends MinionCardModel {
    constructor(props: ShieldbearerCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Shieldbearer',
                desc: 'Taunt',
                mana: 1,
                races: [RaceType.DRAENEI],
                ...props.state
            },
            child: {
                role: new ShieldbearerRoleModel({}),
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }
} 