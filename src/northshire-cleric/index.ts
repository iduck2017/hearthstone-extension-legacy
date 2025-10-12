/**
 * Northshire Cleric
 * 
 * They help the downtrodden and distressed. Also they sell cookies.
 * 
 * Whenever a minion is healed, draw a card.
 * 
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Priest
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Terese Nielsen
 * Collectible
 * 
 * 1/1/3
 */

import { ClassType, CostModel, LibraryUtil, RarityType, MinionCardModel, MinionFeaturesModel, RoleAttackModel, RoleHealthModel, RoleModel } from "hearthstone-core";
import { NorthshireClericFeatureModel } from "./feature";

@LibraryUtil.is('northshire-cleric')
export class NorthshireClericModel extends MinionCardModel {
    constructor(props?: NorthshireClericModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Northshire Cleric',
                desc: 'Whenever a minion is healed, draw a card.',
                flavorDesc: 'They help the downtrodden and distressed. Also they sell cookies.',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PRIEST,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 1 }}),
                        health: new RoleHealthModel({ state: { origin: 3 }}),
                    }
                }),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { 
                        battlecry: [], 
                        feats: [new NorthshireClericFeatureModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
