/*
Knife Juggler
Ambitious Knife Jugglers sometimes graduate to Bomb Jugglers. They never last long enough to make it onto a card though.

After you summon a minion, deal 1 damage to a random enemy.

Type: Minion
Rarity: Rare
Set: Legacy
Class: Neutral
Cost to Craft: 100 / 800 (Golden)
Disenchanting Yield: 20 / 100 (Golden)
Artist: Matt Cavotta
Collectible
*/

import { AttackModel, CardModel, ClassType, FeaturesModel, HealthModel, MinionModel, RaceType, RarityType, RoleModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { KnifeJugglerFeatureModel } from "./feature";

@LibraryUtil.is('knife-juggler')
export class KnifeJugglerModel extends CardModel {
    constructor(props: KnifeJugglerModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Knife Juggler',
                desc: 'After you summon a minion, deal 1 damage to a random enemy.',
                isCollectible: true,
                flavorDesc: 'Ambitious Knife Jugglers sometimes graduate to Bomb Jugglers. They never last long enough to make it onto a card though.',
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                // Set cost to 2
                cost: new CostModel({ state: { origin: 2 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        // Set attack to 2
                        attack: new AttackModel({ state: { origin: 2 }}),
                        // Set health to 2
                        health: new HealthModel({ state: { origin: 2 }}),
                        // Add feature for summon effect
                        features: new FeaturesModel({
                            child: {
                                items: [new KnifeJugglerFeatureModel({})]
                            }
                        })
                    },
                })
            },
            refer: { ...props.refer }
        });
    }
} 