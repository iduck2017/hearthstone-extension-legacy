/*
Demolisher
Laying siege isn't fun for anyone. It's not even all that effective, now that everyone has a flying mount.

At the start of your turn, deal 2 damage to a random enemy.

Type: Minion
Minion Type: Mech
Rarity: Rare
Set: Legacy
Class: Neutral
Cost to Craft: 100 / 800 (Golden)
Disenchanting Yield: 20 / 100 (Golden)
Artist: Raymond Swanland
Collectible
*/

import { MinionModel, FeatureModel, HealthModel, AttackModel, RoleModel, CardHooksModel, ClassType, RarityType, CardModel, RaceType } from "hearthstone-core";
import { DemolisherHookModel } from "./hook";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('demolisher')
export class DemolisherModel extends CardModel {
    constructor(props: DemolisherModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Demolisher',
                desc: 'At the start of your turn, deal 2 damage to a random enemy.',
                isCollectible: true,
                flavorDesc: 'Laying siege isn\'t fun for anyone. It\'s not even all that effective, now that everyone has a flying mount.',
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 3 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.MECH] },
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 4 }}),   
                    }
                }),
                hooks: new CardHooksModel({
                    child: { startTurn: [
                        new DemolisherHookModel({})
                    ]}
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 