import { MinionCardModel, RaceType } from "hearthstone-core";
import { StonetuskBoarRoleModel } from "./role";

export class StonetuskBoarCardModel extends MinionCardModel {
    constructor(props: StonetuskBoarCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Stonetusk Boar',
                desc: 'Charge',
                mana: 1,
                races: [RaceType.BEAST],
                ...props.state,
            },
            child: {
                role: new StonetuskBoarRoleModel({}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}