/**
 * Mirror Image Minion
 * 
 * A 0/2 minion with Taunt created by Mirror Image spell.
 * 
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Mage
 * Collectible: No
 */

import { ClassType, RoleHealthModel, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RoleFeatsModel, TauntModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('mirror-image-minion')
export class MirrorImageMinionModel extends MinionCardModel {
    constructor(loader?: Loader<MirrorImageMinionModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Mirror Image',
                    desc: 'Taunt',
                    flavorDesc: '',
                    isCollectible: false,
                    rarity: RarityType.COMMON,
                    races: [],
                    class: ClassType.MAGE,
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 0 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 0 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 2 }})),
                            feats: new RoleFeatsModel(() => ({
                                child: {
                                    taunt: new TauntModel()
                                }
                            }))
                        }
                    })),
                    feats: new MinionFeatsModel(() => ({
                        child: { battlecry: [] }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
} 