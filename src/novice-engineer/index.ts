/*
Novice Engineer
"Half of this class will not graduate… since they'll have been turned to chickens." - Tinkmaster Overspark, teaching Gizmos 101.

Battlecry: Draw a card.

Type: Minion
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Karl Richardson
Collectible
*/

import { AttackModel, ClassType, HealthModel, MinionModel, RaceType, RarityType, RoleModel, RoleEntriesModel, CardHooksModel, CardModel } from "hearthstone-core";
import { NoviceEngineerBattlecryModel } from "./battlecry";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('novice-engineer')
export class NoviceEngineerModel extends CardModel {
    constructor(props: NoviceEngineerModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Novice Engineer',
                desc: 'Battlecry: Draw a card.',
                isCollectible: true,
                flavorDesc: '"Half of this class will not graduate… since they\'ll have been turned to chickens." - Tinkmaster Overspark, teaching Gizmos 101.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 1 }}), 
                    }
                }),
                hooks: new CardHooksModel({
                    child: {
                        battlecry: [new NoviceEngineerBattlecryModel({})]
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }
} 