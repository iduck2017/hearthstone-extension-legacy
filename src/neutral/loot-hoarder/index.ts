/*
 * Loot Hoarder 2/2/1
 * Always roll need.
 * Deathrattle: Draw a card.
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Jim Nelson
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";
import { LootHoarderDeathrattleModel } from "./deathrattle";

@LibraryUtil.is('loot-hoarder')
export class LootHoarderModel extends MinionCardModel {
    constructor(props?: LootHoarderModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Loot Hoarder',
                desc: 'Deathrattle: Draw a card.',
                flavorDesc: 'Always roll need.',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                deathrattle: props.child?.deathrattle ?? [new LootHoarderDeathrattleModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
