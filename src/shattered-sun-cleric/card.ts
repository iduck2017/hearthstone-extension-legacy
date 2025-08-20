import { MinionCardModel } from "hearthstone-core";
import { ShatteredSunClericRoleModel } from "./role";
import { ShatteredSunClericBattlecryModel } from "./battlecry";

export class ShatteredSunClericCardModel extends MinionCardModel {
    constructor(props: ShatteredSunClericCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Shattered Sun Cleric',
                desc: 'Battlecry: Give a friendly minion +1/+1.',
                mana: 2,
                races: [],
                ...props.state,
            },
            child: {
                role: new ShatteredSunClericRoleModel({}),
                battlecry: [
                    ...props.child?.battlecry ?? [], 
                    new ShatteredSunClericBattlecryModel({})
                ],
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}