/*
 * Bloodmage Thalnos
 * He's in charge of the Annual Scarlet Monastery Blood Drive!
 * Spell Damage +1 Deathrattle: Draw a card.
 * Type: Minion
 * Minion Type: Undead
 * Rarity: Legendary
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 1600 / 3200 (Golden)
 * Disenchanting Yield: 400 / 1600 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 */

import { RoleAttackModel, ClassType, RoleHealthModel, MinionCardModel, RaceType, RarityType, RoleModel, SpellDamageModel, RoleFeatsModel, MinionFeatsModel, LibraryUtil, CostModel } from "hearthstone-core";
import { BloodmageThalnosDeathrattleModel } from "./deathrattle";

@LibraryUtil.is('bloodmage-thalnos')
export class BloodmageThalnosModel extends MinionCardModel {
    constructor(props?: BloodmageThalnosModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Bloodmage Thalnos',
                desc: 'Spell Damage +1 Deathrattle: Draw a card.',
                isCollectible: true,
                flavorDesc: 'He\'s in charge of the Annual Scarlet Monastery Blood Drive!',
                rarity: RarityType.LEGENDARY,
                class: ClassType.NEUTRAL,
                races: [RaceType.UNDEAD],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 2 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 1 }}),
                        health: new RoleHealthModel({ state: { origin: 1 }}), 
                    }
                }),
                feats: props.child?.feats ?? new MinionFeatsModel({
                    child: {
                        deathrattle: [new BloodmageThalnosDeathrattleModel()],
                        list: [new SpellDamageModel({ state: { offset: 1 }})]
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
} 