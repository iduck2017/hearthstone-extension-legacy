/*
 * Ironbeak Owl 3/2/1
 * Their wings are silent but their screech is... whatever the opposite of silent is.
 * Battlecry: Silence a minion.
 * Type: Minion
 * Minion Type: Beast
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Trevor Jacobs
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";
import { IronbeakOwlBattlecryModel } from "./battlecry";

@LibraryUtil.is('ironbeak-owl')
export class IronbeakOwlModel extends MinionCardModel {
    constructor(props?: IronbeakOwlModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Ironbeak Owl',
                desc: 'Battlecry: Silence a minion.',
                flavorDesc: 'Their wings are silent but their screech is... whatever the opposite of silent is.',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.BEAST],
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 3 }}),
                role: new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 2 }}),
                        health: new RoleHealthModel({ state: { origin: 1 }}),
                    }
                }),
                feats: new MinionFeatsModel({
                    child: { 
                        battlecry: [new IronbeakOwlBattlecryModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
