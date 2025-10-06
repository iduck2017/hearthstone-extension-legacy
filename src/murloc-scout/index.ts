/**
 * Murloc Scout
 * 
 * A small but brave murloc scout.
 * 
 * Type: Minion
 * Minion Type: Murloc
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Collectible: No
 */

import { ClassType, RoleHealthModel, MinionCardModel, MinionHooksModel, RaceType, RarityType, RoleAttackModel, RoleModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('murloc-scout')
export class MurlocScoutModel extends MinionCardModel {
    constructor(loader?: Loader<MurlocScoutModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Murloc Scout',
                    desc: '',
                    isCollectible: false,
                    flavorDesc: 'A small but brave murloc scout.',
                    rarity: RarityType.COMMON,
                    races: [RaceType.MURLOC],
                    class: ClassType.NEUTRAL,
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 1 }})),
                    role: new RoleModel(() => ({
                        state: { races: [RaceType.MURLOC] },
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 1 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 1 }})),
                        }
                    })),
                    feats: new MinionHooksModel(() => ({
                        child: { battlecry: [] }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
} 