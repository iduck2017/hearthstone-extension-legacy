/*
 * Razorfen Hunter 3/2/3
 * Someone did mess with Tuskerr once. ONCE.
 * Battlecry: Summon a 1/1 Boar.
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Clint Langley
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";
import { RazorfenHunterBattlecryModel } from "./battlecry";

@LibraryUtil.is('razorfen-hunter')
export class RazorfenHunterModel extends MinionCardModel {
    constructor(props?: RazorfenHunterModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Razorfen Hunter',
                desc: 'Battlecry: Summon a 1/1 Boar.',
                flavorDesc: 'Someone did mess with Tuskerr once. ONCE.',
                collectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 3 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                battlecry: props.child?.battlecry ?? [new RazorfenHunterBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
