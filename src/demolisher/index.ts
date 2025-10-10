/*
 * Demolisher 3/1/4
 * Laying siege isn't fun for anyone. It's not even all that effective, now that everyone has a flying mount.
 * At the start of your turn, deal 2 damage to a random enemy.
 * Type: Minion
 * Minion Type: Mech
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Raymond Swanland
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { DemolisherFeatureModel } from "./start-turn";

@LibraryUtil.is('demolisher')
export class DemolisherModel extends MinionCardModel {
    constructor(props?: DemolisherModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Demolisher',
                desc: 'At the start of your turn, deal 2 damage to a random enemy.',
                flavorDesc: 'Laying siege isn\'t fun for anyone. It\'s not even all that effective, now that everyone has a flying mount.',
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                races: [RaceType.MECH],
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 3 }}),
                role: new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 1 }}),
                        health: new RoleHealthModel({ state: { origin: 4 }}),
                    }
                }),
                feats: new MinionFeatsModel({
                    child: { 
                        battlecry: [],
                        startTurn: [new DemolisherFeatureModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 