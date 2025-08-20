import { MinionCardModel, RaceType } from "hearthstone-core";
import { LightwardenRoleModel } from "./role";

export class LightwardenCardModel extends MinionCardModel {
    constructor(props: LightwardenCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Lightwarden',
                desc: 'Whenever a character is healed, gain +2 Attack.',
                mana: 1,
                races: [RaceType.BEAST],
                ...props.state,
            },
            child: {
                role: new LightwardenRoleModel({}),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }

}
