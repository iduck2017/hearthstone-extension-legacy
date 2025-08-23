// Young Priestess - At the end of your turn, give another random friendly minion +1 Health
// Type: Minion, Rarity: Rare, Set: Legacy, Class: Neutral
// "She can't wait to learn Power Word: Fortitude Rank 2."

import { AttackModel, CardHooksModel, ClassType, CostModel, FeaturesModel, HealthModel, MinionModel, RaceType, RarityType, RoleModel } from "hearthstone-core";
import { YoungPriestessHookModel } from "./hook";

export class YoungPriestessModel extends MinionModel {
    constructor(props: YoungPriestessModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Young Priestess',
                desc: 'At the end of your turn, give another random friendly minion +1 Health.',
                races: [],
                flavorDesc: 'She can\'t wait to learn Power Word: Fortitude Rank 2.',
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 1 }}),
                    }
                }),
                hooks: new CardHooksModel({
                    child: {
                        endTurn: [new YoungPriestessHookModel({})]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 