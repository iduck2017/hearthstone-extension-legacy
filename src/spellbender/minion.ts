/**
 * Spellbender Minion
 * 
 * A 1/3 minion summoned by Spellbender secret.
 * 
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Mage
 * Collectible: No
 */

import { ClassType, HealthModel, MinionCardModel, MinionHooksModel, RarityType, RoleAttackModel, RoleModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('spellbender-minion')
export class SpellbenderMinionModel extends MinionCardModel {
    constructor(loader?: Loader<SpellbenderMinionModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Spellbender',
                    desc: '',
                    isCollectible: false,
                    flavorDesc: '',
                    rarity: RarityType.COMMON,
                    races: [],
                    class: ClassType.MAGE,
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { current: 1 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { current: 1 }})),
                            health: new HealthModel(() => ({ state: { origin: 3 }})),
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: { battlecry: [] }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}