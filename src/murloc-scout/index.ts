// Murloc Scout - 1/1 Murloc summoned by Murloc Tidehunter
// Type: Minion, Minion Type: Murloc

import { AttackModel, ClassType, HealthModel, MinionModel, RaceType, RarityType, RoleModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";

export class MurlocScoutModel extends MinionModel {
    constructor(props: MurlocScoutModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Scout',
                desc: '',
                races: [RaceType.MURLOC],
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 1 }}),
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
} 