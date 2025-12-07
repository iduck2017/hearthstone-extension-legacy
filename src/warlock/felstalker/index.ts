/**
 * Felstalker
 *
 * This puppy chews up cards instead of shoes.
 *
 * Battlecry: Discard a random card.
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
 * 2 mana 4/3
 */

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";
import { FelstalkerBattlecryModel } from "./battlecry";

@LibraryService.is('felstalker')
export class FelstalkerModel extends MinionCardModel {
    constructor(props?: FelstalkerModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Felstalker',
                desc: 'Battlecry: Discard a random card.',
                flavorDesc: 'This puppy chews up cards instead of shoes.',
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARLOCK,
                races: [RaceType.DEMON],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 4 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                battlecry: props.child?.battlecry ?? [new FelstalkerBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

