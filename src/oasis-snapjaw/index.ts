/*
 * Oasis Snapjaw 4/2/7
 * His dreams of flying and breathing fire like his idol will never be realized.
 * Type: Minion
 * Minion Type: Beast
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Ittoku
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType } from "hearthstone-core";

@LibraryUtil.is('oasis-snapjaw')
export class OasisSnapjawModel extends MinionCardModel {
    constructor(props?: OasisSnapjawModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Oasis Snapjaw',
                desc: '',
                flavorDesc: 'His dreams of flying and breathing fire like his idol will never be realized.',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.BEAST],
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 4 }}),
                role: new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 2 }}),
                        health: new RoleHealthModel({ state: { origin: 7 }}),
                    }
                }),
                feats: new MinionFeatsModel({
                    child: { 
                        battlecry: []
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
