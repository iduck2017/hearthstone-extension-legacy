/*
 * Gruul 8/7/7
 * He's Gruul "the Dragonkiller". He just wanted to cuddle them… he never meant to…
 * At the end of each turn, gain +1/+1.
 * Type: Minion
 * Rarity: Legendary
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 1600 / 3200 (Golden)
 * Disenchanting Yield: 400 / 1600 (Golden)
 * Artist: Kev Walker
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { GruulFeatureModel } from "./feature";

@LibraryUtil.is('gruul')
export class GruulModel extends MinionCardModel {
    constructor(props?: GruulModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Gruul',
                desc: 'At the end of each turn, gain +1/+1.',
                flavorDesc: 'He\'s Gruul "the Dragonkiller". He just wanted to cuddle them… he never meant to…',
                isCollectible: true,
                rarity: RarityType.LEGENDARY,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 8 }}),
                role: new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 7 }}),
                        health: new RoleHealthModel({ state: { origin: 7 }}),
                    }
                }),
                feats: new MinionFeatsModel({
                    child: { 
                        battlecry: [],
                        feature: [new GruulFeatureModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
