/*
 * Bloodsail Corsair
 * Every pirate uses the same four digits to access Automated Gold Dispensers. It's called the "Pirate's Code".
 * 
 * Battlecry: Remove 1 Durability from your opponent's weapon.
 * 
 * Type: Minion
 * Minion Type: Pirate
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Randy Gallegos
 * Collectible
 */

import { RoleAttackModel, ClassType, RoleHealthModel, LibraryUtil, RaceType, RarityType, RoleModel, CostModel, MinionFeatsModel, MinionCardModel } from "hearthstone-core";
import { BloodsailCorsairBattlecryModel } from "./battlecry";
import { Loader } from "set-piece";

@LibraryUtil.is('bloodsail-corsair')
export class BloodsailCorsairModel extends MinionCardModel {
    constructor(loader?: Loader<BloodsailCorsairModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Bloodsail Corsair',
                    desc: 'Battlecry: Remove 1 Durability from your opponent\'s weapon.',
                    isCollectible: true,
                    flavorDesc: 'Every pirate uses the same four digits to access Automated Gold Dispensers. It\'s called the "Pirate\'s Code".',
                    rarity: RarityType.RARE,
                    class: ClassType.NEUTRAL,
                    races: [RaceType.PIRATE],
                    ...props.state,
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
                        child: { battlecry: [new BloodsailCorsairBattlecryModel()] }
                    })),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        });
    }
} 