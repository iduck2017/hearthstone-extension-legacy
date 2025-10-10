/*
 * Tauren Warrior 3/2/3
 * Tauren Warrior: Champion of Mulgore, Slayer of Quilboar, Rider of Thunderbluff Elevators.
 * Taunt Has +3 Attack while damaged.
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Paul Warzecha
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType, TauntModel, RoleFeatsModel } from "hearthstone-core";
import { TaurenWarriorFeatureModel } from "./feature";

@LibraryUtil.is('tauren-warrior')
export class TaurenWarriorModel extends MinionCardModel {
    constructor(props?: TaurenWarriorModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Tauren Warrior',
                desc: 'Taunt Has +3 Attack while damaged.',
                flavorDesc: 'Tauren Warrior: Champion of Mulgore, Slayer of Quilboar, Rider of Thunderbluff Elevators.',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 3 }}),
                role: new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 2 }}),
                        health: new RoleHealthModel({ state: { origin: 3 }}),
                        feats: new RoleFeatsModel({
                            child: {
                                taunt: new TauntModel(),
                                list: [new TaurenWarriorFeatureModel()]
                            }
                        })
                    }
                }),
                feats: new MinionFeatsModel({
                    child: { 
                        battlecry: []
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
