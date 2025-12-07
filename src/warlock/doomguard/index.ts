/**
 * Doomguard
 *
 * Summoning a doomguard is risky. Someone is going to die.
 *
 * Charge. Battlecry: Discard two random cards.
 *
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Lucas Graciano
 * Collectible
 *
 * 5 mana 5/7
 */

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RaceType, ChargeModel } from "hearthstone-core";
import { DoomguardBattlecryModel } from "./battlecry";

@LibraryService.is('doomguard')
export class DoomguardModel extends MinionCardModel {
    constructor(props?: DoomguardModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Doomguard',
                desc: 'Charge. Battlecry: Discard two random cards.',
                flavorDesc: 'Summoning a doomguard is risky. Someone is going to die.',
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARLOCK,
                races: [RaceType.DEMON],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 5 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 5 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 7 }}),
                charge: props.child?.charge ?? new ChargeModel(),
                battlecry: props.child?.battlecry ?? [new DoomguardBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

