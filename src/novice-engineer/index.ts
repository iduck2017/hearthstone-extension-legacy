/*
 * Novice Engineer 2/1/1
 * "Half of this class will not graduate… since they'll have been turned to chickens." - Tinkmaster Overspark, teaching Gizmos 101.
 * Battlecry: Draw a card.
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Karl Richardson
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { Loader } from "set-piece";
import { NoviceEngineerBattlecryModel } from "./battlecry";

@LibraryUtil.is('novice-engineer')
export class NoviceEngineerModel extends MinionCardModel {
    constructor(loader?: Loader<NoviceEngineerModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Novice Engineer',
                    desc: 'Battlecry: Draw a card.',
                    flavorDesc: '"Half of this class will not graduate… since they\'ll have been turned to chickens." - Tinkmaster Overspark, teaching Gizmos 101.',
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
                            attack: new RoleAttackModel(() => ({ state: { origin: 1 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 1 }})),
                        }
                    })),
                    feats: new MinionFeatsModel(() => ({
                        child: { 
                            battlecry: [new NoviceEngineerBattlecryModel()]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
