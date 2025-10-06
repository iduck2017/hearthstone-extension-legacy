/*
 * War Golem 7/7/7
 * Golems are not afraid, but for some reason they still run when you cast Fear on them. Instinct, maybe? A desire to blend in?
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Dave Kendall
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('war-golem')
export class WarGolemModel extends MinionCardModel {
    constructor(loader?: Loader<WarGolemModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'War Golem',
                    desc: '',
                    flavorDesc: 'Golems are not afraid, but for some reason they still run when you cast Fear on them. Instinct, maybe? A desire to blend in?',
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 7 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 7 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 7 }})),
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
