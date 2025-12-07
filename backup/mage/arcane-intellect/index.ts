/**
 * Arcane Intellect 3
 * Playing this card makes you SMARTER. And let's face it: we could all stand to be a little smarter.
 * 
 * Draw 2 cards.
 * 
 * Type: Spell
 * Spell School: Arcane
 * Rarity: Free
 * Set: Legacy
 * Class: Mage
 * Artist: Dave Berggren
 * Collectible
 */

import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { ArcaneIntellectEffectModel } from "./effect";

@LibraryService.is('arcane-intellect')
export class ArcaneIntellectModel extends SpellCardModel {
    constructor(props?: ArcaneIntellectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Arcane Intellect",
                desc: "Draw 2 cards.",
                flavorDesc: "Playing this card makes you SMARTER. And let's face it: we could all stand to be a little smarter.",
                collectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.MAGE,
                schools: [SchoolType.ARCANE],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                effects: props.child?.effects ?? [new ArcaneIntellectEffectModel()],
                ...props.child 
            }
        });
    }
}
