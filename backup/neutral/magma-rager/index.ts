/*
 * Magma Rager 3/5/1
 * He likes to think he is powerful, but pretty much anyone can solo Molten Core now.
 * Type: Minion
 * Minion Type: Elemental
 * Rarity: Free
 * Set: Legacy
 * Class: Neutral
 * Artist: Matt Gaser
 * Collectible
 */

import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionFeaturesModel, RarityType, RoleAttackModel, RaceType } from "hearthstone-core";

@LibraryUtil.is('magma-rager')
export class MagmaRagerModel extends MinionCardModel {
    constructor(props?: MagmaRagerModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Magma Rager',
                desc: '',
                flavorDesc: 'He likes to think he is powerful, but pretty much anyone can solo Molten Core now.',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [RaceType.ELEMENTAL],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 3 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 5 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 1 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
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
