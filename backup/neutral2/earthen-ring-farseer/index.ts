/*
 * Earthen Ring Farseer 3/3/3
 * He can see really far, and he doesn't use a telescope like those filthy pirates.
 * Battlecry: Restore 3 Health.
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";
import { EarthenRingFarseerBattlecryModel } from "./battlecry";

@LibraryUtil.is('earthen-ring-farseer')
export class EarthenRingFarseerModel extends MinionCardModel {
    constructor(props?: EarthenRingFarseerModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Earthen Ring Farseer',
                desc: 'Battlecry: Restore 3 Health.',
                flavorDesc: 'He can see really far, and he doesn\'t use a telescope like those filthy pirates.',
                collectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 3 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 3 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                battlecry: props.child?.battlecry ?? [new EarthenRingFarseerBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 