/*
Silverback Patriarch
He likes to act like he's in charge, but the silverback matriarch actually runs things.

Taunt

Type: Minion
Minion Type: Beast
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Daren Bader
Collectible
*/

import { MinionModel, FeatureModel, HealthModel, AttackModel, RoleModel, CardHooksModel, ClassType, RarityType, CardModel, RaceType, RoleEntriesModel, TauntModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('silverback-patriarch')
export class SilverbackPatriarchModel extends CardModel {
    constructor(props: SilverbackPatriarchModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Silverback Patriarch',
                desc: 'Taunt',
                isCollectible: true,
                flavorDesc: 'He likes to act like he\'s in charge, but the silverback matriarch actually runs things.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 3 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.BEAST] },
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 4 }}),   
                        entries: new RoleEntriesModel({
                            child: {
                                // Add Taunt effect
                                taunt: new TauntModel({})
                            }
                        })
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 