/*
 * Silver Hand Knight 5/4/4
 * It's good to be a knight. Less so to be one's squire.
 * Battlecry: Summon a 2/2 Squire.
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Matt Starbuck
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { Loader } from "set-piece";
import { SilverHandKnightBattlecryModel } from "./battlecry";

@LibraryUtil.is('silver-hand-knight')
export class SilverHandKnightModel extends MinionCardModel {
    constructor(loader?: Loader<SilverHandKnightModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Silver Hand Knight',
                    desc: 'Battlecry: Summon a 2/2 Squire.',
                    flavorDesc: 'It\'s good to be a knight. Less so to be one\'s squire.',
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 5 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 4 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 4 }})),
                        }
                    })),
                    feats: new MinionFeatsModel(() => ({
                        child: { 
                            battlecry: [new SilverHandKnightBattlecryModel()]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}
