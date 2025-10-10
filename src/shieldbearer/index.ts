/*
 * Shieldbearer 1/0/4
 * Have you seen the size of the shields in this game?? This is no easy job.
 * Taunt
 * Type: Minion
 * Minion Type: Draenei
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType, TauntModel, RoleFeatsModel } from "hearthstone-core";

@LibraryUtil.is('shieldbearer')
export class ShieldbearerModel extends MinionCardModel {
    constructor(props?: ShieldbearerModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Shieldbearer',
                desc: 'Taunt',
                flavorDesc: 'Have you seen the size of the shields in this game?? This is no easy job.',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.DRAENEI],
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                role: new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 0 }}),
                        health: new RoleHealthModel({ state: { origin: 4 }}),
                        feats: new RoleFeatsModel({
                            child: {
                                taunt: new TauntModel()
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