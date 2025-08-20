import { MinionCardModel, RaceType } from "hearthstone-core";
import { AngryChickenRoleModel } from "./role";

export class AngryChickenCardModel extends MinionCardModel {
    constructor(props: AngryChickenCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Angry Chicken',
                desc: 'Has +5 Attack while damaged.',
                mana: 1,
                races: [RaceType.BEAST],
                ...props.state,
            },
            child: {
                role: new AngryChickenRoleModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}
