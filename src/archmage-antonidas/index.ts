/**
 * Archmage Antonidas
 * Antonidas was the Grand Magus of the Kirin Tor, and Jaina's mentor. This was a big step up from being Grand Magus of Jelly Donuts.
 * 
 * Whenever you cast a spell, add a 'Fireball' spell to your hand.
 * 
 * Type: Minion
 * Rarity: Legendary
 * Set: Legacy
 * Class: Mage
 * Cost to Craft: 1600 / 3200 (Golden)
 * Disenchanting Yield: 400 / 1600 (Golden)
 * Artist: Wayne Reynolds
 * Collectible
 */

import { RoleAttackModel, ClassType, RoleHealthModel, MinionCardModel, RarityType, RoleModel, MinionFeatsModel, LibraryUtil, CostModel } from "hearthstone-core";
import { ArchmageAntonidasFeatureModel } from "./feature";

@LibraryUtil.is('archmage-antonidas')
export class ArchmageAntonidasModel extends MinionCardModel {
    constructor(props?: ArchmageAntonidasModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Archmage Antonidas',
                desc: 'Whenever you cast a spell, add a \'Fireball\' spell to your hand.',
                isCollectible: true,
                flavorDesc: 'Antonidas was the Grand Magus of the Kirin Tor, and Jaina\'s mentor. This was a big step up from being Grand Magus of Jelly Donuts.',
                rarity: RarityType.LEGENDARY,
                class: ClassType.MAGE,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 7 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 5 }}),
                        health: new RoleHealthModel({ state: { origin: 7 }}), 
                    }
                }),
                feats: props.child?.feats ?? new MinionFeatsModel({
                    child: {
                        battlecry: [], 
                        feats: [new ArchmageAntonidasFeatureModel()]
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}
