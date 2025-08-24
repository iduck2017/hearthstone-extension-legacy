/*
Sen'jin Shieldmasta
Sen'jin Village is nice, if you like trolls and dust.

Taunt

Type: Minion
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Brian Despain
Collectible
*/

import { MinionModel, FeatureModel, HealthModel, AttackModel, RoleModel, CardHooksModel, ClassType, RarityType, CardModel, RaceType, RoleEntriesModel, TauntModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('senjin-shieldmasta')
export class SenjinShieldmastaModel extends CardModel {
    constructor(props: SenjinShieldmastaModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Sen\'jin Shieldmasta',
                desc: 'Taunt',
                isCollectible: true,
                flavorDesc: 'Sen\'jin Village is nice, if you like trolls and dust.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 4 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 3 }}),
                        health: new HealthModel({ state: { origin: 5 }}),   
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