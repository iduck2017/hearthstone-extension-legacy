/*
Booty Bay Bodyguard
You can hire him... until someone offers him enough gold to turn on you.

Taunt

Type: Minion
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Matt Cavotta
Collectible
*/

import { MinionCardModel, RoleHealthModel, RoleAttackModel, RoleModel, ClassType, RarityType, RoleEntriesModel, TauntModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('booty-bay-bodyguard')
export class BootyBayBodyguardModel extends MinionCardModel {
    constructor(loader?: Loader<BootyBayBodyguardModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Booty Bay Bodyguard',
                    desc: 'Taunt',
                    isCollectible: true,
                    flavorDesc: 'You can hire him... until someone offers him enough gold to turn on you.',
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [],
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 5 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 5 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 4 }})),
                            entries: new RoleEntriesModel(() => ({
                                child: {
                                    taunt: new TauntModel()
                                }
                            }))
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
} 