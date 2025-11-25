/**
 * Siphon Soul
 *
 * You probably should avoid siphoning your own soul. You might create some kind of weird infinite loop.
 *
 * Destroy a minion. Restore 3 Health to your hero.
 *
 * Type: Spell
 * Rarity: Epic
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 400 / 1600 (Golden)
 * Disenchanting Yield: 100 / 400 (Golden)
 * Artist: Tyler Walpole
 * Collectible
 *
 * 4 mana
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { SiphonSoulEffectModel } from "./effect";

@LibraryUtil.is('siphon-soul')
export class SiphonSoulModel extends SpellCardModel {
    constructor(props?: SiphonSoulModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Siphon Soul",
                desc: "Destroy a minion. Restore 3 Health to your hero.",
                flavorDesc: "You probably should avoid siphoning your own soul. You might create some kind of weird infinite loop.",
                isCollectible: true,
                rarity: RarityType.EPIC,
                class: ClassType.WARLOCK,
                schools: [SchoolType.SHADOW],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 4 }}),
                effects: props.child?.effects ?? [new SiphonSoulEffectModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

