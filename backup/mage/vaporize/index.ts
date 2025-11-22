/**
 * Vaporize 3
 * Rumor has it that Deathwing brought about the Cataclysm after losing a game to this card. We may never know the truth.
 * 
 * Secret: When a minion attacks your hero, destroy it.
 * 
 * Type: Spell
 * Spell School: Fire
 * Rarity: Rare
 * Set: Legacy
 * Class: Mage
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Raymond Swanland
 * Collectible
 */

import { ClassType, CostModel, LibraryUtil, RarityType, SchoolType, SecretCardModel } from "hearthstone-core";
import { VaporizeFeatureModel } from "./feature";

@LibraryUtil.is('vaporize')
export class VaporizeModel extends SecretCardModel {
    constructor(props?: VaporizeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Vaporize",
                desc: "Secret: When a minion attacks your hero, destroy it.",
                flavorDesc: "Rumor has it that Deathwing brought about the Cataclysm after losing a game to this card. We may never know the truth.",
                collectible: true,
                rarity: RarityType.RARE,
                class: ClassType.MAGE,
                schools: [SchoolType.FIRE],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                feats: [new VaporizeFeatureModel()],
                ...props.child 
            }
        });
    }
}
