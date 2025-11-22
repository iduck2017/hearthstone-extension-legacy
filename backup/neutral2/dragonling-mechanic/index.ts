/*
 * Dragonling Mechanic 4/2/4
 * She is still working on installing the rocket launcher add-on for Mr. Bitey.
 * Battlecry: Summon a 2/1 Mechanical Dragonling.
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Warren Mahy
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";
import { DragonlingMechanicBattlecryModel } from "./battlecry";

@LibraryUtil.is('dragonling-mechanic')
export class DragonlingMechanicModel extends MinionCardModel {
    constructor(props?: DragonlingMechanicModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Dragonling Mechanic',
                desc: 'Battlecry: Summon a 2/1 Mechanical Dragonling.',
                flavorDesc: 'She is still working on installing the rocket launcher add-on for Mr. Bitey.',
                collectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 4 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 4 }}),
                battlecry: props.child?.battlecry ?? [new DragonlingMechanicBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
