/*
 * Razorfen Hunter 3/2/3
 * Someone did mess with Tuskerr once. ONCE.
 * Battlecry: Summon a 1/1 Boar.
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Clint Langley
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { Loader } from "set-piece";
import { RazorfenHunterBattlecryModel } from "./battlecry";

@LibraryUtil.is('razorfen-hunter')
export class RazorfenHunterModel extends MinionCardModel {
    constructor(loader?: Loader<RazorfenHunterModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Razorfen Hunter',
                    desc: 'Battlecry: Summon a 1/1 Boar.',
                    flavorDesc: 'Someone did mess with Tuskerr once. ONCE.',
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 3 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 2 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 3 }})),
                        }
                    })),
                    feats: new MinionFeatsModel(() => ({
                        child: { 
                            battlecry: [new RazorfenHunterBattlecryModel()]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
