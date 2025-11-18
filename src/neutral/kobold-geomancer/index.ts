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

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, RarityType, RoleAttackModel, RaceType, SpellDamageModel } from "hearthstone-core";

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
                collectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? [new SpellDamageModel({ state: { offset: 1 }})],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
