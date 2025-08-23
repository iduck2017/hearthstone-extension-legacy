// Murloc Tidehunter - Battlecry: Summon a 1/1 Murloc Scout
// Type: Minion, Minion Type: Murloc, Rarity: Free, Set: Legacy, Class: Neutral

import { AttackModel, CardHooksModel, ClassType, HealthModel, MinionModel, RaceType, RarityType, RoleModel } from "hearthstone-core";
import { MurlocTidehunterBattlecryModel } from "./battlecry";

export class MurlocTidehunterModel extends MinionModel {
    constructor(props: MurlocTidehunterModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Tidehunter',
                desc: 'Battlecry: Summon a 1/1 Murloc Scout.',
                mana: 2,
                races: [RaceType.MURLOC],
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state
            },
            child: {
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 1 }}),
                    }
                }),
                hooks: new CardHooksModel({
                    child: {
                        battlecry: [new MurlocTidehunterBattlecryModel({})]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
