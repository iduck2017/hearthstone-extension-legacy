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

import { ClassType, RoleHealthModel, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('spellbender-minion')
export class SpellbenderMinionModel extends MinionCardModel {
    constructor(props?: SpellbenderMinionModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Spellbender',
                desc: '',
                isCollectible: false,
                flavorDesc: '',
                rarity: RarityType.COMMON,
                races: [],
                class: ClassType.MAGE,
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                role: new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 1 }}),
                        health: new RoleHealthModel({ state: { origin: 3 }}),
                    }
                }),
                feats: new MinionFeatsModel({
                    child: { battlecry: [] }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}