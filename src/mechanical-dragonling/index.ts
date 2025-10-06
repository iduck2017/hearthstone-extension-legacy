/*
 * Mechanical Dragonling 1/2/1
 * Type: Minion
 * Minion Type: Dragon
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Warren Mahy
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('mechanical-dragonling')
export class MechanicalDragonlingModel extends MinionCardModel {
    constructor(loader?: Loader<MechanicalDragonlingModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Mechanical Dragonling',
                    desc: '',
                    flavorDesc: '',
                    isCollectible: false,
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [RaceType.DRAGON],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 1 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 2 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 1 }})),
                        }
                    })),
                    feats: new MinionFeatsModel(() => ({
                        child: { 
                            battlecry: []
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
