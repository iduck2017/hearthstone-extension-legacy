import { MinionCardModel, RaceType } from "hearthstone-core";
import { HungryCrabRoleModel } from "./role";
import { HungryCrabBattlecryModel } from "./battlecry";

export class HungryCrabCardModel extends MinionCardModel {
    constructor(props: HungryCrabCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Hungry Crab',
                desc: 'Battlecry: Destroy a Murloc and gain +2/+2.',
                mana: 1,
                races: [RaceType.BEAST],
                ...props.state
            },
            child: {
                role: new HungryCrabRoleModel({}),
                battlecry: [
                    ...props.child?.battlecry ?? [], 
                    new HungryCrabBattlecryModel({})
                ],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}