/*
Booty Bay Bodyguard
You can hire him... until someone offers him enough gold to turn on you.

Taunt

Type: Minion
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Matt Cavotta
Collectible
*/

import { MinionModel, HealthModel, AttackModel, RoleModel, ClassType, RarityType, CardModel, RaceType, RoleEntriesModel, TauntModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('booty-bay-bodyguard')
export class BootyBayBodyguardModel extends CardModel {
    constructor(props: BootyBayBodyguardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Booty Bay Bodyguard',
                desc: 'Taunt',
                isCollectible: true,
                flavorDesc: 'You can hire him... until someone offers him enough gold to turn on you.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 5 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 5 }}),
                        health: new HealthModel({ state: { origin: 4 }}),
                        entries: new RoleEntriesModel({
                            child: {
                                // Add Taunt effect
                                taunt: new TauntModel({})
                            }
                        })
                    },
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 