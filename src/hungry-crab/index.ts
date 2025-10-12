/*
 * Hungry Crab
 * Murloc. It's what's for dinner.
 * 
 * Battlecry: Destroy a Murloc and gain +2/+2.
 * 
 * Type: Minion
 * Minion Type: Beast
 * Rarity: Epic
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 400 / 1600 (Golden)
 * Disenchanting Yield: 100 / 400 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 */

import { MinionCardModel, RoleHealthModel, RoleAttackModel, RaceType, RoleModel, MinionFeaturesModel, ClassType, RarityType, LibraryUtil, CostModel } from "hearthstone-core";
import { HungryCrabBattlecryModel } from "./battlecry";

@LibraryUtil.is('hungry-crab')
export class HungryCrabModel extends MinionCardModel {
    constructor(props?: HungryCrabModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Hungry Crab',
                desc: 'Battlecry: Destroy a Murloc and gain +2/+2.',
                isCollectible: true,
                flavorDesc: 'Murloc. It\'s what\'s for dinner.',
                rarity: RarityType.EPIC,
                class: ClassType.NEUTRAL,
                races: [RaceType.BEAST],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 1 }}),
                        health: new RoleHealthModel({ state: { origin: 2 }}),   
                    }
                }),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: {
                        battlecry: [new HungryCrabBattlecryModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}