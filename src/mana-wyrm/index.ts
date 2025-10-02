/**
 * Mana Wyrm
 * 
 * These wyrms feed on arcane energies, and while they are generally considered a nuisance rather than a real threat, you really shouldn't leave them alone with a bucket of mana.
 * Whenever you cast a spell, gain +1 Attack.
 * 
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Mage
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Blizzard Cinematics
 * Collectible
 * 
 * 1/1/3
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionHooksModel, RarityType, RoleAttackModel, RoleModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { ManaWyrmFeatureModel } from "./feature";

@LibraryUtil.is('mana-wyrm')
export class ManaWyrmModel extends MinionCardModel {
    constructor(loader?: Loader<ManaWyrmModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Mana Wyrm',
                    desc: 'Whenever you cast a spell, gain +1 Attack.',
                    flavorDesc: 'These wyrms feed on arcane energies, and while they are generally considered a nuisance rather than a real threat, you really shouldn\'t leave them alone with a bucket of mana.',
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.MAGE,
                    races: [],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 1 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 1 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 3 }})),
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: { battlecry: [] }
                    })),
                    feats: props.child?.feats ?? [new ManaWyrmFeatureModel()],
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
