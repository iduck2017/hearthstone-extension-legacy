/**
 * Dread Infernal
 *
 * "INFERNOOOOOOOOOO!" - Jaraxxus, Eredar Lord of the Burning Legion
 *
 * Battlecry: Deal 1 damage to ALL other characters.
 *
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Zoltan & Gabor
 * Collectible
 *
 * 6 mana 6/6
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";
import { DreadInfernalBattlecryModel } from "./battlecry";

@LibraryUtil.is('dread-infernal')
export class DreadInfernalModel extends MinionCardModel {
    constructor(props?: DreadInfernalModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Dread Infernal',
                desc: 'Battlecry: Deal 1 damage to ALL other characters.',
                flavorDesc: '"INFERNOOOOOOOOOO!" - Jaraxxus, Eredar Lord of the Burning Legion',
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.WARLOCK,
                races: [RaceType.DEMON],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 6 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 6 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 6 }}),
                battlecry: props.child?.battlecry ?? [new DreadInfernalBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

