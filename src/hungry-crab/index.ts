/*
 * Hungry Crab
 * Murloc. It's what's for dinner.
 * 
 * Battlecry: Destroy a Murloc and gain +2/+2.
 * 
 * Type: Minion
 * Minion Type: Beast
 * Rarity: Epic
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 400 / 1600 (Golden)
 * Disenchanting Yield: 100 / 400 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 */

import { MinionCardModel, RoleHealthModel, RoleAttackModel, RaceType, RoleModel, MinionFeatsModel, ClassType, RarityType, LibraryUtil, CostModel } from "hearthstone-core";
import { HungryCrabBattlecryModel } from "./battlecry";
import { Loader } from "set-piece";

@LibraryUtil.is('hungry-crab')
export class HungryCrabModel extends MinionCardModel {
    constructor(loader?: Loader<HungryCrabModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Hungry Crab',
                    desc: 'Battlecry: Destroy a Murloc and gain +2/+2.',
                    isCollectible: true,
                    flavorDesc: 'Murloc. It\'s what\'s for dinner.',
                    rarity: RarityType.EPIC,
                    class: ClassType.NEUTRAL,
                    races: [RaceType.BEAST],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 1 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 1 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 2 }})),   
                        }
                    })),
                    feats: new MinionFeatsModel(() => ({
                        child: {
                            battlecry: [new HungryCrabBattlecryModel()]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}