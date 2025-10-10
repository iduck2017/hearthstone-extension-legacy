/**
 * Polymorph
 * There was going to be a pun in this flavor text, but it just came out baa-d.
 * 
 * Transform a minion into a 1/1 Sheep.
 * 
 * Type: Spell
 * Spell School: Arcane
 * Rarity: Free
 * Set: Legacy
 * Class: Mage
 * Artist: Vance Kovacs
 * Collectible
 */
import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SpellCardModel, SpellFeatsModel } from "hearthstone-core";
import { PolymorphEffectModel } from "./effect";

@LibraryUtil.is('polymorph')
export class PolymorphModel extends SpellCardModel {
    constructor(props?: PolymorphModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Polymorph",
                desc: "Transform a minion into a 1/1 Sheep.",
                flavorDesc: "There was going to be a pun in this flavor text, but it just came out baa-d.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.MAGE,
                schools: [SchoolType.ARCANE],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 4 }}),
                feats: props.child?.feats ?? new SpellFeatsModel({
                    child: { effects: [new PolymorphEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}
