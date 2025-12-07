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

import { RoleAttackModel, ClassType, RoleHealthModel, LibraryService, RaceType, RarityType, CostModel, MinionCardModel } from "hearthstone-core";
import { BloodsailCorsairBattlecryModel } from "./battlecry";

@LibraryService.is('bloodsail-corsair')
export class BloodsailCorsairModel extends MinionCardModel {
    constructor(props?: BloodsailCorsairModel['props']) {
        props = props ?? {};
        super({
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
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 1 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 2 }}),
                battlecry: props.child?.battlecry ?? [new BloodsailCorsairBattlecryModel()],
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 