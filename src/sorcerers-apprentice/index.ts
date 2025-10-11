/**
 * Sorcerer's Apprentice 2/3/2
 * Apprentices are great for bossing around. "Conjure me some mana buns! And a coffee! Make that a mana coffee!"
 * 
 * Your spells cost (1) less (but not less than 1).
 * 
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Mage
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel } from "hearthstone-core";
import { SorcerersApprenticeFeatureModel } from "./feature";

@LibraryUtil.is('sorcerers-apprentice')
export class SorcerersApprenticeModel extends MinionCardModel {
    constructor(props?: SorcerersApprenticeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Sorcerer\'s Apprentice',
                desc: 'Your spells cost (1) less (but not less than 1).',
                flavorDesc: 'Apprentices are great for bossing around. "Conjure me some mana buns! And a coffee! Make that a mana coffee!"',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.MAGE,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 3 }}),
                        health: new RoleHealthModel({ state: { origin: 2 }}),
                    }
                }),
                feats: props.child?.feats ?? new MinionFeatsModel({
                    child: {
                        feats: [new SorcerersApprenticeFeatureModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
