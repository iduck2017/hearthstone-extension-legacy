/*
 * Stormwind Knight 4/2/5
 * They're still embarrassed about "The Deathwing Incident".
 * Charge
 * Type: Minion
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Ladronn
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryService, MinionCardModel, RarityType, RoleAttackModel, RaceType, ChargeModel } from "hearthstone-core";

@LibraryService.is('stormwind-knight')
export class StormwindKnightModel extends MinionCardModel {
    constructor(props?: StormwindKnightModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Stormwind Knight',
                desc: 'Charge',
                flavorDesc: 'They\'re still embarrassed about "The Deathwing Incident".',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 4 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 2 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 5 }}),
                charge: props.child?.charge ?? new ChargeModel({ state: { isEnabled: true } }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
