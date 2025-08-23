import { HealthModel, AttackModel, WindfuryModel, RoleEntriesModel, MinionCardModel, RaceType, RoleModel, WindfuryStatus } from "hearthstone-core";

export class YoungDragonhawkCardModel extends MinionCardModel {
    constructor(props: YoungDragonhawkCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Young Dragonhawk',
                desc: 'Windfury',
                mana: 1,
                races: [RaceType.BEAST],
                ...props.state,
            },
            child: {
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 1 }}),
                        entries: new RoleEntriesModel({
                            child: { windfury: new WindfuryModel({ state: { status: WindfuryStatus.ACTIVE }}) }
                        })
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}