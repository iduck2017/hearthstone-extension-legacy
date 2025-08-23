import { AttackModel, CardHooksModel, HealthModel, MinionCardModel, RoleModel } from "hearthstone-core";
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
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 3 }}),
                        health: new HealthModel({ state: { origin: 2 }}),
                    },
                }),
                hooks: new CardHooksModel({
                    child: {
                        battlecry: [new ShatteredSunClericBattlecryModel({})]
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}