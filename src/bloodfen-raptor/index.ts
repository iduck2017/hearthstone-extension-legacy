/*
 * Bloodfen Raptor
 * "Kill 30 raptors." - Hemet Nesingwary
 * Type: Minion
 * Minion Type: Beast
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Dan Brereton
 * Collectible
 */

import { RoleAttackModel, ClassType, RoleHealthModel, LibraryUtil, MinionCardModel, RaceType, RarityType, CostModel } from "hearthstone-core";

@LibraryUtil.is('bloodfen-raptor')
export class BloodfenRaptorModel extends MinionCardModel {
    constructor(props?: BloodfenRaptorModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Bloodfen Raptor',
                desc: '',
                isCollectible: true,
                flavorDesc: '"Kill 30 raptors." - Hemet Nesingwary',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.BEAST],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 3 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 2 }}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 