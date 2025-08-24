// Captain's Parrot
// Pirates and Parrots go together like Virmen and Carrots.
// Battlecry: Draw a Pirate from your deck.
// Type: Minion
// Minion Type: Beast
// Rarity: Epic
// Set: Legacy
// Class: Neutral
// Cost to Craft: 400 / 1600 (Golden)
// Disenchanting Yield: 100 / 400 (Golden)
// Artist: Daren Bader
// Collectible

import { AttackModel, ClassType, HealthModel, MinionModel, RaceType, RarityType, RoleModel, CardHooksModel, CardModel } from "hearthstone-core";
import { CaptainsParrotBattlecryModel } from "./battlecry";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('captains-parrot')
export class CaptainsParrotModel extends CardModel {
    constructor(props: CaptainsParrotModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Captain\'s Parrot',
                desc: 'Battlecry: Draw a Pirate from your deck.',
                flavorDesc: 'Pirates and Parrots go together like Virmen and Carrots.',
                rarity: RarityType.EPIC,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.BEAST] },
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 1 }}), 
                    }
                }),
                hooks: new CardHooksModel({
                    child: {
                        battlecry: [new CaptainsParrotBattlecryModel({})]
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 