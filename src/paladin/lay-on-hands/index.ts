/**
 * Lay on Hands
 *
 * A grammatically awkward life saver.
 *
 * Restore 8 Health. Draw 3 cards.
 *
 * Type: Spell
 * Rarity: Epic
 * Set: Legacy
 * Class: Paladin
 * Cost to Craft: 400 / 1600 (Golden)
 * Disenchanting Yield: 100 / 400 (Golden)
 * Artist: Raymond Swanland
 * Collectible
 *
 * 6 mana
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { LayOnHandsEffectModel } from "./effect";

@LibraryService.is('lay-on-hands')
export class LayOnHandsModel extends SpellCardModel {
    constructor(props?: LayOnHandsModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Lay on Hands",
                desc: "Restore 8 Health. Draw 3 cards.",
                flavorDesc: "A grammatically awkward life saver.",
                isCollectible: true,
                rarity: RarityType.EPIC,
                class: ClassType.PALADIN,
                schools: [SchoolType.HOLY],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 6 }}),
                effects: props.child?.effects ?? [new LayOnHandsEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

