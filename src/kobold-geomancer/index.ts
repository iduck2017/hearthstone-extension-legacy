/*
 * Kobold Geomancer 2/2/2
 * In the old days, Kobolds were the finest candle merchants in the land. Then they got pushed too far...
 * Spell Damage +1
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Gabor Szikszai
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeatsModel, RarityType, RoleAttackModel, RoleModel, RaceType, SpellBuffModel } from "hearthstone-core";

@LibraryUtil.is('kobold-geomancer')
export class KoboldGeomancerModel extends MinionCardModel {
    constructor(props?: KoboldGeomancerModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Kobold Geomancer',
                desc: 'Spell Damage +1',
                flavorDesc: 'In the old days, Kobolds were the finest candle merchants in the land. Then they got pushed too far...',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
                role: new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 2 }}),
                        health: new RoleHealthModel({ state: { origin: 2 }}),
                    }
                }),
                feats: new MinionFeatsModel({
                    child: { 
                        battlecry: [],
                        spellBuff: new SpellBuffModel({ state: { offset: 1 }})
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
