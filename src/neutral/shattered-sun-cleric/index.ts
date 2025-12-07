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

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";
import { ShatteredSunClericBattlecryModel } from "./battlecry";

@LibraryService.is('shattered-sun-cleric')
export class ShatteredSunClericModel extends MinionCardModel {
    constructor(props?: ShatteredSunClericModel['props']) {
        props = props ?? {};
        super({
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
                cost: props.child?.cost ??  new CostModel({ state: { origin: 3 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 3 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 2 }}),
                battlecry: props.child?.battlecry ?? [new ShatteredSunClericBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}