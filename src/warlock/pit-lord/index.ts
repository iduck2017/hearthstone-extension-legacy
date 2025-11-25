/**
 * Pit Lord
 *
 * Mannoroth, Magtheridon, and Brutallus may be dead, but it turns out there are a LOT of pit lords.
 *
 * Battlecry: Deal 5 damage to your hero.
 *
 * Type: Minion
 * Rarity: Epic
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 400 / 1600 (Golden)
 * Disenchanting Yield: 100 / 400 (Golden)
 * Artist: Glenn Rane
 * Collectible
 *
 * 4 mana 5/6
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";
import { PitLordBattlecryModel } from "./battlecry";

@LibraryUtil.is('pit-lord')
export class PitLordModel extends MinionCardModel {
    constructor(props?: PitLordModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Pit Lord',
                desc: 'Battlecry: Deal 5 damage to your hero.',
                flavorDesc: 'Mannoroth, Magtheridon, and Brutallus may be dead, but it turns out there are a LOT of pit lords.',
                isCollectible: true,
                rarity: RarityType.EPIC,
                class: ClassType.WARLOCK,
                races: [RaceType.DEMON],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 4 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 5 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 6 }}),
                battlecry: props.child?.battlecry ?? [new PitLordBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

