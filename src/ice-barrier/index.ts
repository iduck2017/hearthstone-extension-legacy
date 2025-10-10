/**
 * Ice Barrier 3
 * This is Rank 1. Rank 2 is Chocolate Milk Barrier.
 * 
 * Secret: When your hero is attacked, gain 8 Armor.
 * 
 * Type: Spell
 * Spell School: Frost
 * Rarity: Common
 * Set: Legacy
 * Class: Mage
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Alex Garner
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SecretCardModel, SpellFeatsModel } from "hearthstone-core";
import { IceBarrierFeatureModel } from "./feature";

@LibraryUtil.is('ice-barrier')
export class IceBarrierModel extends SecretCardModel {
    constructor(props?: IceBarrierModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Ice Barrier",
                desc: "Secret: When your hero is attacked, gain 8 Armor.",
                flavorDesc: "This is Rank 1. Rank 2 is Chocolate Milk Barrier.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.MAGE,
                schools: [SchoolType.FROST],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                feats: new SpellFeatsModel({
                    child: {
                        items: [new IceBarrierFeatureModel()]
                    }
                }),
                ...props.child 
            }
        });
    }
}
