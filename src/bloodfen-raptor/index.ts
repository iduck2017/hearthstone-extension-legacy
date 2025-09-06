/*
 * Bloodfen Raptor
 * "Kill 30 raptors." - Hemet Nesingwary
 * Type: Minion
 * Minion Type: Beast
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Dan Brereton
 * Collectible
 */

import { AttackModel, ClassType, HealthModel, LibraryUtil, MinionModel, RaceType, RarityType, RoleModel, CostModel } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('bloodfen-raptor')
export class BloodfenRaptorModel extends MinionModel {
    constructor(loader?: Loader<BloodfenRaptorModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Bloodfen Raptor',
                    desc: '',
                    isCollectible: true,
                    flavorDesc: '"Kill 30 raptors." - Hemet Nesingwary',
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [RaceType.BEAST],
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 2 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new AttackModel(() => ({ state: { origin: 3 }})),
                            health: new HealthModel(() => ({ state: { origin: 2 }})), 
                        }
                    })),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        });
    }
} 