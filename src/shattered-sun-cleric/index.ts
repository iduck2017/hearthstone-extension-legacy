/*
 * Shattered Sun Cleric 2/3/2
 * They always have a spare flask of Sunwell Energy Drink™!
 * Battlecry: Give a friendly minion +1/+1.
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { Loader } from "set-piece";
import { ShatteredSunClericBattlecryModel } from "./battlecry";

@LibraryUtil.is('shattered-sun-cleric')
export class ShatteredSunClericModel extends MinionCardModel {
    constructor(loader?: Loader<ShatteredSunClericModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Shattered Sun Cleric',
                    desc: 'Battlecry: Give a friendly minion +1/+1.',
                    flavorDesc: 'They always have a spare flask of Sunwell Energy Drink™!',
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
                            attack: new RoleAttackModel(() => ({ state: { origin: 3 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 2 }})),
                        }
                    })),
                    feats: new MinionFeatsModel(() => ({
                        child: { 
                            battlecry: [new ShatteredSunClericBattlecryModel()]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}