/**
 * Water Elemental
 * 
 * Don't summon a water elemental at a party. It'll dampen the mood.
 * 
 * Freeze any character damaged by this minion.
 * 
 * Type: Minion
 * Minion Type: Elemental
 * Rarity: Free
 * Set: Legacy
 * Class: Mage
 * Artist: John Avon
 * Collectible
 * 4/3/6
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionHooksModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { Loader } from "set-piece";
import { WaterElementalFeatureModel } from "./feature";

@LibraryUtil.is('water-elemental')
export class WaterElementalModel extends MinionCardModel {
    constructor(loader?: Loader<WaterElementalModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Water Elemental',
                    desc: 'Freeze any character damaged by this minion.',
                    flavorDesc: 'Don\'t summon a water elemental at a party. It\'ll dampen the mood.',
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.MAGE,
                    races: [RaceType.ELEMENTAL],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 4 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 3 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 6 }})),
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: { 
                            battlecry: [], 
                            items: [new WaterElementalFeatureModel()]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
