/*
Fen Creeper
He used to be called Bog Beast, but it confused people because he wasn't an actual beast. Boom, New Name!

Taunt

Type: Minion
Rarity: Common
Set: Legacy
Class: Neutral
Cost to Craft: 40 / 400 (Golden)
Disenchanting Yield: 5 / 50 (Golden)
Artist: Monica Langlois
Collectible
*/

import { MinionModel, HealthModel, AttackModel, RoleModel, ClassType, RarityType, CardModel, RaceType, RoleEntriesModel, TauntModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('fen-creeper')
export class FenCreeperModel extends CardModel {
    constructor(props: FenCreeperModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Fen Creeper',
                desc: 'Taunt',
                isCollectible: true,
                flavorDesc: 'He used to be called Bog Beast, but it confused people because he wasn\'t an actual beast. Boom, New Name!',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 5 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 3 }}),
                        health: new HealthModel({ state: { origin: 6 }}),
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