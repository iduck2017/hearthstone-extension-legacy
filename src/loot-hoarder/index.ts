/*
Loot Hoarder
Always roll need.

Deathrattle: Draw a card.

Type: Minion
Rarity: Common
Set: Legacy
Class: Neutral
Cost to Craft: 40 / 400 (Golden)
Disenchanting Yield: 5 / 50 (Golden)
Artist: Jim Nelson
Collectible
*/

import { AttackModel, ClassType, HealthModel, MinionModel, RaceType, RarityType, RoleModel, RoleEntriesModel, CardHooksModel, CardModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { LootHoarderDeathrattleModel } from "./deathrattle";

@LibraryUtil.is('loot-hoarder')
export class LootHoarderModel extends CardModel {
    constructor(props: LootHoarderModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Loot Hoarder',
                desc: 'Deathrattle: Draw a card.',
                isCollectible: true,
                flavorDesc: 'Always roll need.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 1 }}), 
                    }
                }),
                hooks: new CardHooksModel({
                    child: {
                        deathrattle: [new LootHoarderDeathrattleModel({})]
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }
} 