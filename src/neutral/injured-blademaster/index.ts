/*
 * Injured Blademaster 3/4/7
 * He claims it is an old war wound, but we think he just cut himself shaving.
 * Battlecry: Deal 4 damage to HIMSELF.
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Samwise
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";
import { InjuredBlademasterBattlecryModel } from "./battlecry";

@LibraryUtil.is('injured-blademaster')
export class InjuredBlademasterModel extends MinionCardModel {
    constructor(props?: InjuredBlademasterModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Injured Blademaster',
                desc: 'Battlecry: Deal 4 damage to HIMSELF.',
                flavorDesc: 'He claims it is an old war wound, but we think he just cut himself shaving.',
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 3 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 4 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 7 }}),
                battlecry: props.child?.battlecry ?? [new InjuredBlademasterBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
