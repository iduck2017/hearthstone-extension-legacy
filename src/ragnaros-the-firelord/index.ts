/*
 * Ragnaros the Firelord
 * Ragnaros was summoned by the Dark Iron dwarves, who were eventually enslaved by the Firelord. Summoning Ragnaros often doesn't work out the way you want it to.
 * Can't attack. At the end of your turn, deal 8 damage to a random enemy.
 * Type: Minion
 * Minion Type: Elemental
 * Rarity: Legendary
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 1600 / 3200 (Golden)
 * Disenchanting Yield: 400 / 1600 (Golden)
 * Artist: Greg Staples
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType, RoleFeatsModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { RagnarosFeatureModel } from "./feature";
import { RagnarosEndTurnModel } from "./end-turn";

@LibraryUtil.is('ragnaros-the-firelord')
export class RagnarosTheFirelordModel extends MinionCardModel {
    constructor(loader?: Loader<RagnarosTheFirelordModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Ragnaros the Firelord',
                    desc: 'Can\'t attack. At the end of your turn, deal 8 damage to a random enemy.',
                    flavorDesc: 'Ragnaros was summoned by the Dark Iron dwarves, who were eventually enslaved by the Firelord. Summoning Ragnaros often doesn\'t work out the way you want it to.',
                    isCollectible: true,
                    rarity: RarityType.LEGENDARY,
                    class: ClassType.NEUTRAL,
                    races: [RaceType.ELEMENTAL],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 8 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 8 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 8 }})),
                            feats: new RoleFeatsModel(() => ({
                                child: {
                                    items: [new RagnarosFeatureModel()]
                                }
                            }))
                        }
                    })),
                    feats: new MinionFeatsModel(() => ({
                        child: { 
                            battlecry: [],
                            endTurn: [new RagnarosEndTurnModel()]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
