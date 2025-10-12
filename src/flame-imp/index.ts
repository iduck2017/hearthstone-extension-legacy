/*
 * Flame Imp 1/3/2
 * Imps like being on fire. They just do.
 * Battlecry: Deal 3 damage to your hero.
 * Type: Minion
 * Minion Type: Demon
 * Rarity: Common
 * Set: Legacy
 * Class: Warlock
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeaturesModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { FlameImpBattlecryModel } from "./battlecry";

@LibraryUtil.is('flame-imp')
export class FlameImpModel extends MinionCardModel {
    constructor(props?: FlameImpModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Flame Imp',
                desc: 'Battlecry: Deal 3 damage to your hero.',
                flavorDesc: 'Imps like being on fire. They just do.',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.WARLOCK,
                races: [RaceType.DEMON],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 3 }}),
                        health: new RoleHealthModel({ state: { origin: 2 }}),
                    }
                }),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { 
                        battlecry: [new FlameImpBattlecryModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
