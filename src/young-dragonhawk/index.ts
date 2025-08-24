import { HealthModel, AttackModel, WindfuryModel, RoleEntriesModel, MinionModel, RaceType, RoleModel, WindfuryStatus, ClassType, RarityType, CostModel, CardModel } from "hearthstone-core";

export class YoungDragonhawkModel extends CardModel {
    constructor(props: YoungDragonhawkModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Young Dragonhawk',
                desc: 'Windfury',
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.BEAST] },
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