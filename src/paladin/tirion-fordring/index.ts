/**
 * Tirion Fordring
 *
 * If you haven't heard the Tirion Fordring theme song, it's because it doesn't exist.
 *
 * Divine Shield, Taunt Deathrattle: Equip a 5/3 Ashbringer.
 *
 * Type: Minion
 * Rarity: Legendary
 * Set: Legacy
 * Class: Paladin
 * Cost to Craft: 1600 / 3200 (Golden)
 * Disenchanting Yield: 400 / 1600 (Golden)
 * Artist: Brom
 * Collectible
 *
 * 8 mana 6/6
 */

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, TauntModel, DivineShieldModel } from "hearthstone-core";
import { TirionFordringDeathrattleModel } from "./deathrattle";

@LibraryService.is('tirion-fordring')
export class TirionFordringModel extends MinionCardModel {
    constructor(props?: TirionFordringModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Tirion Fordring',
                desc: 'Divine Shield, Taunt Deathrattle: Equip a 5/3 Ashbringer.',
                flavorDesc: 'If you haven\'t heard the Tirion Fordring theme song, it\'s because it doesn\'t exist.',
                isCollectible: true,
                rarity: RarityType.LEGENDARY,
                class: ClassType.PALADIN,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 8 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 6 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 6 }}),
                divineShield: props.child?.divineShield ?? new DivineShieldModel(),
                taunt: props.child?.taunt ?? new TauntModel(),
                deathrattle: props.child?.deathrattle ?? [new TirionFordringDeathrattleModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

