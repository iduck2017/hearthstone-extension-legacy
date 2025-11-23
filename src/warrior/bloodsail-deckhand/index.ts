/**
 * Bloodsail Deckhand
 * 
 * Piracy is technically a discount.
 * 
 * Battlecry: The next weapon you play costs (1) less.
 * 
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Warrior
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Vika Yarova
 * Collectible
 * 
 * 1 mana
 * 2/1
 */

import { ClassType, CostModel, LibraryUtil, MinionCardModel, RaceType, RarityType, RoleAttackModel, RoleHealthModel } from "hearthstone-core";
import { BloodsailDeckhandBattlecryModel } from "./battlecry";

@LibraryUtil.is('bloodsail-deckhand')
export class BloodsailDeckhandModel extends MinionCardModel {
    constructor(props?: BloodsailDeckhandModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Bloodsail Deckhand",
                desc: "Battlecry: The next weapon you play costs (1) less.",
                flavorDesc: "Piracy is technically a discount.",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.WARRIOR,
                races: [],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 1 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                battlecry: props.child?.battlecry ?? [new BloodsailDeckhandBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

