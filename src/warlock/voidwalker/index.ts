/**
 * Voidwalker
 *
 * No relation to "The Voidsteppers", the popular Void-based dance troupe.
 *
 * Taunt
 *
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 *
 * 1 mana 1/3
 */

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RaceType, TauntModel } from "hearthstone-core";

@LibraryService.is('voidwalker')
export class VoidwalkerModel extends MinionCardModel {
    constructor(props?: VoidwalkerModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Voidwalker',
                desc: 'Taunt',
                flavorDesc: 'No relation to "The Voidsteppers", the popular Void-based dance troupe.',
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARLOCK,
                races: [RaceType.DEMON],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 1 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                taunt: props.child?.taunt ?? new TauntModel(),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

