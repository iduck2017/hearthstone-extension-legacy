/**
 * Crimson Clergy
 * 
 * He won't drop the ball.
 * 
 * Overheal: Draw a card.
 * 
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Priest
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Konstantin Porubov
 * Collectible
 * 
 * 1/1/3
 */

import { ClassType, CostModel, LibraryUtil, RarityType, MinionCardModel, MinionHooksModel, RoleAttackModel, RoleHealthModel, RoleModel, RoleFeatsModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { CrimsonClergyOverhealModel } from "./overheal";

@LibraryUtil.is('crimson-clergy')
export class CrimsonClergyModel extends MinionCardModel {
    constructor(loader?: Loader<CrimsonClergyModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Crimson Clergy',
                    desc: 'Overheal: Draw a card.',
                    flavorDesc: 'He won\'t drop the ball.',
                    isCollectible: true,
                    rarity: RarityType.RARE,
                    class: ClassType.PRIEST,
                    races: [],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 1 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 1 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 3 }})),
                            feats: new RoleFeatsModel(() => ({
                                child: { overheal: [new CrimsonClergyOverhealModel()] }
                            }))
                        },
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: { battlecry: [] }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            };
        });
    }
}
