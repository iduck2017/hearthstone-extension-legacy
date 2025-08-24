/*
Magma Rager
He likes to think he is powerful, but pretty much anyone can solo Molten Core now.

Type: Minion
Minion Type: Elemental
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Matt Gaser
Collectible
*/

import { MinionModel, FeatureModel, HealthModel, AttackModel, RoleModel, CardHooksModel, ClassType, RarityType, CardModel, RaceType } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('magma-rager')
export class MagmaRagerModel extends CardModel {
    constructor(props: MagmaRagerModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Magma Rager',
                desc: '',
                isCollectible: true,
                flavorDesc: 'He likes to think he is powerful, but pretty much anyone can solo Molten Core now.',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 3 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.ELEMENTAL] },
                    child: {
                        attack: new AttackModel({ state: { origin: 5 }}),
                        health: new HealthModel({ state: { origin: 1 }}),   
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 