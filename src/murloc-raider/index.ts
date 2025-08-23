import { HealthModel, AttackModel, MinionCardModel, RaceType, RoleModel } from "hearthstone-core";

export class MurlocRaiderCard extends MinionCardModel {
    constructor(props: MurlocRaiderCard['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Raider',
                desc: '',
                mana: 1,
                races: [RaceType.MURLOC],
                ...props.state
            },
            child: {
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 1 }}),
                    },
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}   