/**
 * Truesilver Champion
 * 
 * It Slices, it Dices. You can cut a tin can with it. (But you wouldn't want to.)
 * 
 * Whenever your hero attacks, restore 3 Health to it.
 * 
 * Type: Weapon
 * Rarity: Common
 * Set: Legacy
 * Class: Paladin
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Ryan Sook
 * Collectible
 * 
 * 4 mana 4/2
 */

import { ClassType, CostModel, WeaponActionModel, RarityType, WeaponAttackModel, WeaponCardModel, LibraryService } from "hearthstone-core";
import { TruesilverChampionFeatureModel } from "./feature";

@LibraryService.is('truesilver-champion')
export class TruesilverChampionModel extends WeaponCardModel {
    constructor(props?: TruesilverChampionModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Truesilver Champion",
                desc: "Whenever your hero attacks, restore 3 Health to it.",
                flavorDesc: "It Slices, it Dices. You can cut a tin can with it. (But you wouldn't want to.)",
                class: ClassType.PALADIN,
                rarity: RarityType.COMMON,
                isCollectible: true,
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 4 }}),
                attack: new WeaponAttackModel({ state: { origin: 4 }}),
                action: new WeaponActionModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? [new TruesilverChampionFeatureModel()],
                ...props.child
            },
            refer: { ...props.refer }
        })
    }
}

