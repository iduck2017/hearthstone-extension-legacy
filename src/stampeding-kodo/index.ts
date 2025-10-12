/*
 * Stampeding Kodo 5/3/5
 * This Kodo is so big that he can stampede by himself.
 * Battlecry: Destroy a random enemy minion with 2 or less Attack.
 * Type: Minion
 * Minion Type: Beast
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Daren Bader
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeaturesModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { StampedingKodoBattlecryModel } from "./battlecry";

@LibraryUtil.is('stampeding-kodo')
export class StampedingKodoModel extends MinionCardModel {
    constructor(props?: StampedingKodoModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Stampeding Kodo',
                desc: 'Battlecry: Destroy a random enemy minion with 2 or less Attack.',
                flavorDesc: 'This Kodo is so big that he can stampede by himself.',
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                races: [RaceType.BEAST],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 5 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 3 }}),
                        health: new RoleHealthModel({ state: { origin: 5 }}),
                    }
                }),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: { 
                        battlecry: [new StampedingKodoBattlecryModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
