/**
 * Ice Lance
 * 
 * The trick is not to break the lance. Otherwise, you have "Ice Pieces." Ice Pieces aren't as effective.
 * 
 * Freeze a character. If it was already Frozen, deal 4 damage instead.
 * 
 * Type: Spell
 * Spell School: Frost
 * Rarity: Common
 * Set: Legacy
 * Class: Mage
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 */
import { ClassType, CostModel, LibraryService, RarityType, SchoolType, SpellCardModel } from "hearthstone-core";
import { IceLanceEffectModel } from "./effect";

@LibraryService.is('ice-lance')
export class IceLanceModel extends SpellCardModel {
    constructor(props?: IceLanceModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Ice Lance",
                desc: "Freeze a character. If it was already Frozen, deal 4 damage instead.",
                flavorDesc: "The trick is not to break the lance. Otherwise, you have \"Ice Pieces.\" Ice Pieces aren't as effective.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.MAGE,
                schools: [SchoolType.FROST],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                effects: props.child?.effects ?? [new IceLanceEffectModel()],
                ...props.child 
            }
        });
    }
} 