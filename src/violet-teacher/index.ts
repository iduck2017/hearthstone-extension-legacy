/*
 * Violet Teacher 4/3/5
 * If you don't pay attention, you may be turned into a pig. And then you get your name on the board.
 * Whenever you cast a spell, summon a 1/1 Violet Apprentice.
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: James Ryman
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeaturesModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { VioletTeacherFeatureModel } from "./feature";

@LibraryUtil.is('violet-teacher')
export class VioletTeacherModel extends MinionCardModel {
    constructor(props?: VioletTeacherModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Violet Teacher',
                desc: 'Whenever you cast a spell, summon a 1/1 Violet Apprentice.',
                flavorDesc: 'If you don\'t pay attention, you may be turned into a pig. And then you get your name on the board.',
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 4 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 3 }}),
                        health: new RoleHealthModel({ state: { origin: 5 }}),
                    }
                }),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { 
                        battlecry: [],
                        feats: [new VioletTeacherFeatureModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
