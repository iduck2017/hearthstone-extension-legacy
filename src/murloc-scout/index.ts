// Murloc Scout - 1/1 Murloc summoned by Murloc Tidehunter
// Type: Minion, Minion Type: Murloc

import { AttackModel, HealthModel, MinionCardModel, RaceType, RoleModel } from "hearthstone-core";

export class MurlocScoutModel extends MinionCardModel {
    constructor(props: MurlocScoutModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Scout',
                desc: '',
                mana: 1,
                races: [RaceType.MURLOC],
                ...props.state
            },
            child: {
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