/*
 * Harvest Golem 3/2/3
 * "Overheat threshold exceeded. System failure. Wheat clog in port two. Shutting down."
 * Deathrattle: Summon a 2/1 Damaged Golem.
 * Type: Minion
 * Minion Type: Mech
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Brian Despain
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { HarvestGolemDeathrattleModel } from "./deathrattle";

@LibraryUtil.is('harvest-golem')
export class HarvestGolemModel extends MinionCardModel {
    constructor(props?: HarvestGolemModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Harvest Golem',
                desc: 'Deathrattle: Summon a 2/1 Damaged Golem.',
                flavorDesc: '"Overheat threshold exceeded. System failure. Wheat clog in port two. Shutting down."',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.MECH],
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 3 }}),
                role: new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 2 }}),
                        health: new RoleHealthModel({ state: { origin: 3 }}),
                    }
                }),
                feats: new MinionFeatsModel({
                    child: { 
                        battlecry: [],
                        deathrattle: [new HarvestGolemDeathrattleModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
