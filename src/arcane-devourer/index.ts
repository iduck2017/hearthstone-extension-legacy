/*
 * Arcane Devourer
 * Likes her magic with a pinch of salt.
 * Whenever you cast a spell, gain +2/+2.
 * Type: Minion
 * Minion Type: Elemental
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Ivan Fomin
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { ArcaneDevourerFeatureModel } from "./feature";

@LibraryUtil.is('arcane-devourer')
export class ArcaneDevourerModel extends MinionCardModel {
    constructor(props?: ArcaneDevourerModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Arcane Devourer',
                desc: 'Whenever you cast a spell, gain +2/+2.',
                flavorDesc: 'Likes her magic with a pinch of salt.',
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                races: [RaceType.ELEMENTAL],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 8 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 4 }}),
                        health: new RoleHealthModel({ state: { origin: 8 }}),
                    }
                }),
                feats: props.child?.feats ?? new MinionFeatsModel({
                    child: { 
                        battlecry: [], 
                        feats: [new ArcaneDevourerFeatureModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
