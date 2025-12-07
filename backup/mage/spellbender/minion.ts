/**
 * Spellbender Minion
 * 
 * A 1/3 minion summoned by Spellbender secret.
 * 
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Mage
 * Collectible: No
 */

import { ClassType, RoleHealthModel, MinionCardModel, RarityType, RoleAttackModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryService } from "hearthstone-core";

@LibraryService.is('spellbender-minion')
export class SpellbenderMinionModel extends MinionCardModel {
    constructor(props?: SpellbenderMinionModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Spellbender',
                desc: '',
                collectible: false,
                flavorDesc: '',
                rarity: RarityType.COMMON,
                races: [],
                class: ClassType.MAGE,
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 1 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}