/*
 * Amani Berserker
 * If an Amani berserker asks "Joo lookin' at me?!", the correct response is "Nah, mon".
 * Has +3 Attack while damaged.
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Chippy
 * Collectible
 */

import { RoleAttackModel, ClassType, FeatureModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, MinionFeaturesModel } from "hearthstone-core";
import { AmaniBerserkerFeatureModel } from "./feature";
import { CostModel } from "hearthstone-core";

@LibraryUtil.is('amani-berserker')
export class AmaniBerserkerModel extends MinionCardModel {
    constructor(props?: AmaniBerserkerModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Amani Berserker',
                desc: 'Has +3 Attack while damaged.',
                isCollectible: true,
                flavorDesc: 'If an Amani berserker asks "Joo lookin\' at me?!", the correct response is "Nah, mon".',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: {
                        items: [new AmaniBerserkerFeatureModel()]
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 