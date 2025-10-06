/*
 * Mogu'shan Warden 4/1/7
 * All these guys ever do is talk about the Thunder King. BOOOORRRINNG!
 * Taunt
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Cole Eastburn
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType, RoleFeatsModel, TauntModel } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('mogushan-warden')
export class MogushanWardenModel extends MinionCardModel {
    constructor(loader?: Loader<MogushanWardenModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Mogu\'shan Warden',
                    desc: 'Taunt',
                    flavorDesc: 'All these guys ever do is talk about the Thunder King. BOOOORRRINNG!',
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 4 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 1 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 7 }})),
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
