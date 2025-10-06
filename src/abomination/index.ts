/*
 * Abomination 6/4/4
 * Abominations enjoy Fresh Meat and long walks on the beach.
 * Taunt. Deathrattle: Deal 2 damage to ALL characters.
 * Type: Minion
 * Minion Type: Undead
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType, RoleFeatsModel, TauntModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { AbominationDeathrattleModel } from "./deathrattle";

@LibraryUtil.is('abomination')
export class AbominationModel extends MinionCardModel {
    constructor(loader?: Loader<AbominationModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Abomination',
                    desc: 'Taunt. Deathrattle: Deal 2 damage to ALL characters.',
                    flavorDesc: 'Abominations enjoy Fresh Meat and long walks on the beach.',
                    isCollectible: true,
                    rarity: RarityType.RARE,
                    class: ClassType.NEUTRAL,
                    races: [RaceType.UNDEAD],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 6 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 4 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 4 }})),
                            feats: new RoleFeatsModel(() => ({
                                child: {
                                    taunt: new TauntModel()
                                }
                            }))
                        }
                    })),
                    feats: new MinionFeatsModel(() => ({
                        child: { 
                            battlecry: [],
                            deathrattle: [new AbominationDeathrattleModel()]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
