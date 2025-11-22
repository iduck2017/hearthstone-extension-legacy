/**
 * Frothing Berserker
 * 
 * He used to work as an accountant before he tried his hand at Berserkering.
 * 
 * Whenever a minion takes damage, gain +1 Attack.
 * 
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Simon Bisley
 * Collectible
 * 
 * 3 mana 2/4
 */

import { ClassType, CostModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RoleHealthModel } from "hearthstone-core";
import { FrothingBerserkerFeatureModel } from "./feature";

@LibraryUtil.is('frothing-berserker')
export class FrothingBerserkerModel extends MinionCardModel {
    constructor(props?: FrothingBerserkerModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Frothing Berserker",
                desc: "Whenever a minion takes damage, gain +1 Attack.",
                flavorDesc: "He used to work as an accountant before he tried his hand at Berserkering.",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARRIOR,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 4 }}),
                feats: props.child?.feats ?? [new FrothingBerserkerFeatureModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

