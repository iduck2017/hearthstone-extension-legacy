/*
 * Injured Blademaster 3/4/7
 * He claims it is an old war wound, but we think he just cut himself shaving.
 * Battlecry: Deal 4 damage to HIMSELF.
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Samwise
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { Loader } from "set-piece";
import { InjuredBlademasterBattlecryModel } from "./battlecry";

@LibraryUtil.is('injured-blademaster')
export class InjuredBlademasterModel extends MinionCardModel {
    constructor(loader?: Loader<InjuredBlademasterModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Injured Blademaster',
                    desc: 'Battlecry: Deal 4 damage to HIMSELF.',
                    flavorDesc: 'He claims it is an old war wound, but we think he just cut himself shaving.',
                    isCollectible: true,
                    rarity: RarityType.RARE,
                    class: ClassType.NEUTRAL,
                    races: [],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 3 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 4 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 7 }})),
                        }
                    })),
                    feats: new MinionFeatsModel(() => ({
                        child: { 
                            battlecry: [new InjuredBlademasterBattlecryModel()]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
