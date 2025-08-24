/*
Frostwolf Grunt
Grunting is what his father did and his father before that. It's more than just a job.

Taunt

Type: Minion
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Richie Marella
Collectible

Charge
*/

import { AttackModel, CardModel, ClassType, FeaturesModel, HealthModel, MinionModel, RaceType, RarityType, RoleEntriesModel, RoleModel, TauntModel, ChargeModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('frostwolf-grunt')
export class FrostwolfGruntModel extends CardModel {
    constructor(props: FrostwolfGruntModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Frostwolf Grunt',
                desc: 'Taunt\nCharge',
                isCollectible: true,
                flavorDesc: 'Grunting is what his father did and his father before that. It\'s more than just a job.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state
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
                        entries: new RoleEntriesModel({
                            child: {
                                // Add Taunt effect
                                taunt: new TauntModel({}),
                            }
                        })
                    },
                }),
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }
} 