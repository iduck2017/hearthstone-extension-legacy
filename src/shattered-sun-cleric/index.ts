import { AttackModel, CardHooksModel, CardModel, ClassType, HealthModel, MinionModel, RarityType, RoleModel } from "hearthstone-core";
import { ShatteredSunClericBattlecryModel } from "./battlecry";
import { CostModel } from "hearthstone-core";

export class ShatteredSunClericModel extends CardModel {
    constructor(props: ShatteredSunClericModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Shattered Sun Cleric',
                desc: 'Battlecry: Give a friendly minion +1/+1.',
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
                minion: new MinionModel({
                    state: { races: [] },
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