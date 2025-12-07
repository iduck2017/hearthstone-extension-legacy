/**
 * Guardian of Kings
 *
 * Holy beings from the beyond are so cliché!
 *
 * Taunt Battlecry: Restore 6 Health to your hero.
 *
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Paladin
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: E. M. Gist
 * Collectible
 *
 * 7 mana 5/7
 */

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, TauntModel } from "hearthstone-core";
import { GuardianOfKingsBattlecryModel } from "./battlecry";

@LibraryService.is('guardian-of-kings')
export class GuardianOfKingsModel extends MinionCardModel {
    constructor(props?: GuardianOfKingsModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Guardian of Kings',
                desc: 'Taunt Battlecry: Restore 6 Health to your hero.',
                flavorDesc: 'Holy beings from the beyond are so cliché!',
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.PALADIN,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 7 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 5 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 7 }}),
                taunt: props.child?.taunt ?? new TauntModel(),
                battlecry: props.child?.battlecry ?? [new GuardianOfKingsBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

