/**
 * Psychic Conjurer
 * 
 * "I see... a WISP? Why do you have a wisp?!"
 * 
 * Battlecry: Copy a card in your opponent's deck and add it to your hand.
 * 
 * Type: Minion
 * Minion Type: Undead
 * Rarity: Free
 * Set: Legacy
 * Class: Priest
 * Artist: Jim Nelson
 * Collectible
 * 
 * 1/1/2
 */

import { ClassType, CostModel, LibraryUtil, RarityType, MinionCardModel, MinionFeatsModel, RoleAttackModel, RoleHealthModel, RoleModel, RaceType } from "hearthstone-core";
import { PsychicConjurerBattlecryModel } from "./battlecry";

@LibraryUtil.is('psychic-conjurer')
export class PsychicConjurerModel extends MinionCardModel {
    constructor(props?: PsychicConjurerModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Psychic Conjurer',
                desc: 'Battlecry: Copy a card in your opponent\'s deck and add it to your hand.',
                flavorDesc: '"I see... a WISP? Why do you have a wisp?!"',
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PRIEST,
                races: [RaceType.UNDEAD],
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 1 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 1 }}),
                        health: new RoleHealthModel({ state: { origin: 2 }}),
                    }
                }),
                feats: props.child?.feats ?? new MinionFeatsModel({
                    child: { 
                        battlecry: [new PsychicConjurerBattlecryModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
