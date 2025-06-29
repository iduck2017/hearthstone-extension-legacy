import { MinionCardModel } from "hearthstone-core";
import { AngryBirdRoleModel } from "./role";

export class AngryBirdCardModel extends MinionCardModel {
    constructor(props: AngryBirdCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Angry Bird',
                desc: 'Has +5 Attack while damaged.',
                mana: 1,
                ...props.state,
            },
            child: {
                role: new AngryBirdRoleModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}
