/*
Gnomish Inventor
She's never quite sure what she's making, she just knows it's AWESOME!

Battlecry: Draw a card.

Type: Minion
Rarity: Free
Set: Legacy
Class: Neutral
Artist: Court Jones
Collectible
*/

import { MinionModel, HealthModel, AttackModel, RoleModel, ClassType, RarityType, CardModel, RaceType, CardHooksModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { GnomishInventorBattlecryModel } from "./battlecry";

@LibraryUtil.is('gnomish-inventor')
export class GnomishInventorModel extends CardModel {
    constructor(props: GnomishInventorModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Gnomish Inventor',
                desc: 'Battlecry: Draw a card.',
                isCollectible: true,
                flavorDesc: 'She\'s never quite sure what she\'s making, she just knows it\'s AWESOME!',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 4 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 4 }}),
                    },
                }),
                hooks: new CardHooksModel({
                    child: {
                        // Link battlecry effect
                        battlecry: [new GnomishInventorBattlecryModel({})]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 