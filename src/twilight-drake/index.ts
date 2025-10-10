/*
 * Twilight Drake 4/4/1
 * Twilight drakes feed on Mystical Energy. And Tacos.
 * Battlecry: Gain +1 Health for each card in your hand.
 * Type: Minion
 * Minion Type: Dragon
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Jaemin Kim
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { TwilightDrakeBattlecryModel } from "./battlecry";

@LibraryUtil.is('twilight-drake')
export class TwilightDrakeModel extends MinionCardModel {
    constructor(props?: TwilightDrakeModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Twilight Drake',
                desc: 'Battlecry: Gain +1 Health for each card in your hand.',
                flavorDesc: 'Twilight drakes feed on Mystical Energy. And Tacos.',
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                races: [RaceType.DRAGON],
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 4 }}),
                role: new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 4 }}),
                        health: new RoleHealthModel({ state: { origin: 1 }}),
                    }
                }),
                feats: new MinionFeatsModel({
                    child: { 
                        battlecry: [new TwilightDrakeBattlecryModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
