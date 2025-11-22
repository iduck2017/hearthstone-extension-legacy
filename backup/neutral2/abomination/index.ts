/*
 * Abomination 6/4/4
 * Abominations enjoy Fresh Meat and long walks on the beach.
 * Taunt. Deathrattle: Deal 2 damage to ALL characters.
 * Type: Minion
 * Minion Type: Undead
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType, TauntModel } from "hearthstone-core";
import { AbominationDeathrattleModel } from "./deathrattle";

@LibraryUtil.is('abomination')
export class AbominationModel extends MinionCardModel {
    constructor(props?: AbominationModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Abomination',
                desc: 'Taunt. Deathrattle: Deal 2 damage to ALL characters.',
                flavorDesc: 'Abominations enjoy Fresh Meat and long walks on the beach.',
                collectible: true,
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                races: [RaceType.UNDEAD],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 6 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 4 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 4 }}),
                taunt: props.child?.taunt ?? new TauntModel(),
                deathrattle: props.child?.deathrattle ?? [new AbominationDeathrattleModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
