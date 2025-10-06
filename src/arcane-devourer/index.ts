/*
 * Arcane Devourer
 * Likes her magic with a pinch of salt.
 * Whenever you cast a spell, gain +2/+2.
 * Type: Minion
 * Minion Type: Elemental
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Ivan Fomin
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionHooksModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { Loader } from "set-piece";
import { ArcaneDevourerFeatureModel } from "./feature";

@LibraryUtil.is('arcane-devourer')
export class ArcaneDevourerModel extends MinionCardModel {
    constructor(loader?: Loader<ArcaneDevourerModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Arcane Devourer',
                    desc: 'Whenever you cast a spell, gain +2/+2.',
                    flavorDesc: 'Likes her magic with a pinch of salt.',
                    isCollectible: true,
                    rarity: RarityType.RARE,
                    class: ClassType.NEUTRAL,
                    races: [RaceType.ELEMENTAL],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 8 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 4 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 8 }})),
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: { 
                            battlecry: [], 
                            items: [new ArcaneDevourerFeatureModel()]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
