/*
 * Gnomish Inventor 4/2/4
 * She's never quite sure what she's making, she just knows it's AWESOME!
 * Battlecry: Draw a card.
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Court Jones
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";
import { GnomishInventorBattlecryModel } from "./battlecry";

@LibraryUtil.is('gnomish-inventor')
export class GnomishInventorModel extends MinionCardModel {
    constructor(props?: GnomishInventorModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Gnomish Inventor',
                desc: 'Battlecry: Draw a card.',
                flavorDesc: 'She\'s never quite sure what she\'s making, she just knows it\'s AWESOME!',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 4 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 4 }}),
                battlecry: props.child?.battlecry ?? [new GnomishInventorBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
