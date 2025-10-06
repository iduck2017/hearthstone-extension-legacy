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

import { RoleAttackModel, ClassType, RoleHealthModel, MinionCardModel, RarityType, RoleModel, MinionHooksModel, LibraryUtil, CostModel } from "hearthstone-core";
import { ArchmageAntonidasFeatureModel } from "./feature";
import { Loader } from "set-piece";

@LibraryUtil.is('archmage-antonidas')
export class ArchmageAntonidasModel extends MinionCardModel {
    constructor(loader?: Loader<ArchmageAntonidasModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
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
                    cost: new CostModel(() => ({ state: { origin: 7 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 5 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 7 }})), 
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: {
                            battlecry: [], 
                            items: [new ArchmageAntonidasFeatureModel()]
                        }
                    })),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        });
    }
}
