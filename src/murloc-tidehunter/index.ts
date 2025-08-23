// Murloc Tidehunter - Battlecry: Summon a 1/1 Murloc Scout
// Type: Minion, Minion Type: Murloc, Rarity: Free, Set: Legacy, Class: Neutral

import { AttackModel, CardHooksModel, ClassType, HealthModel, MinionModel, RaceType, RarityType, RoleModel } from "hearthstone-core";
import { MurlocTidehunterBattlecryModel } from "./battlecry";
import { CostModel } from "hearthstone-core";

export class MurlocTidehunterModel extends MinionModel {
    constructor(props: MurlocTidehunterModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Tidehunter',
                desc: 'Battlecry: Summon a 1/1 Murloc Scout.',
                races: [RaceType.MURLOC],
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 2 }}),
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
