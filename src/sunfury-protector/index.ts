/*
Sunfury Protector
She carries a shield, but only so she can give it to someone she can stand behind.

Battlecry: Give adjacent minions Taunt.

Type: Minion
Rarity: Rare
Set: Legacy
Class: Neutral
Cost to Craft: 100 / 800 (Golden)
Disenchanting Yield: 20 / 100 (Golden)
Artist: James Ryman
Collectible
*/

import { AttackModel, ClassType, HealthModel, MinionModel, RaceType, RarityType, RoleModel, CardHooksModel, CardModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { SunfuryProtectorBattlecryModel } from "./battlecry";

@LibraryUtil.is('sunfury-protector')
export class SunfuryProtectorModel extends CardModel {
    constructor(props: SunfuryProtectorModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Sunfury Protector',
                desc: 'Battlecry: Give adjacent minions Taunt.',
                isCollectible: true,
                flavorDesc: 'She carries a shield, but only so she can give it to someone she can stand behind.',
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
                minion: new MinionModel({
                    state: { races: [] },
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 3 }}), 
                    }
                }),
                hooks: new CardHooksModel({
                    child: {
                        battlecry: [new SunfuryProtectorBattlecryModel({})]
                    }
                }),
                ...props.child,
            },
            refer: { ...props.refer }
        });
    }
} 