import { MinionCardModel, RaceType } from "hearthstone-core";
import { MurlocRaiderRoleModel } from "./role";

export class MurlocRaiderCardModel extends MinionCardModel {
    constructor(props: MurlocRaiderCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Raider',
                desc: '',
                mana: 1,
                races: [RaceType.MURLOC],
                ...props.state
            },
            child: {
                role: new MurlocRaiderRoleModel({}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}   