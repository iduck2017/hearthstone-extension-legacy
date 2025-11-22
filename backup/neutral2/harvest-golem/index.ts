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

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";
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
                collectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.MECH],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 3 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                deathrattle: props.child?.deathrattle ?? [new HarvestGolemDeathrattleModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
