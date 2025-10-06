/*
 * Frostwolf Grunt 2/2/2
 * Grunting is what his father did and his father before that. It's more than just a job.
 * Taunt
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Richie Marella
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType, TauntModel, RoleFeatsModel } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('frostwolf-grunt')
export class FrostwolfGruntModel extends MinionCardModel {
    constructor(loader?: Loader<FrostwolfGruntModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Frostwolf Grunt',
                    desc: 'Taunt',
                    flavorDesc: 'Grunting is what his father did and his father before that. It\'s more than just a job.',
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 2 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 2 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 2 }})),
                            feats: new RoleFeatsModel(() => ({
                                child: {
                                    taunt: new TauntModel()
                                }
                            }))
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
