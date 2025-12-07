/*
 * Alexstrasza the Life-Binder
 * Friendly Fire: Off
 * Battlecry: Choose a character. If it's friendly, restore 8 Health. If it's an enemy, deal 8 damage.
 * Type: Minion
 * Minion Type: Dragon
 * Rarity: Legendary
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 1600 / 3200 (Golden)
 * Disenchanting Yield: 400 / 1600 (Golden)
 * Artist: Zoltan Boros
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";
import { AlexstraszaBattlecryModel } from "./battlecry";

@LibraryService.is('alexstrasza-the-life-binder')
export class AlexstraszaTheLifeBinderModel extends MinionCardModel {
    constructor(props?: AlexstraszaTheLifeBinderModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Alexstrasza the Life-Binder',
                desc: 'Battlecry: Choose a character. If it\'s friendly, restore 8 Health. If it\'s an enemy, deal 8 damage.',
                flavorDesc: 'Friendly Fire: Off',
                isCollectible: true,
                rarity: RarityType.LEGENDARY,
                class: ClassType.NEUTRAL,
                races: [RaceType.DRAGON],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 9 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 8 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 8 }}),
                battlecry: props.child?.battlecry ?? [new AlexstraszaBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
