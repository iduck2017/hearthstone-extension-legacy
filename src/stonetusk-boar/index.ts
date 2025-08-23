import { ChargeModel, HealthModel, AttackModel, MinionCardModel, RaceType, RoleModel, RoleEntriesModel } from "hearthstone-core";

export class StonetuskBoarModel extends MinionCardModel {
    constructor(props: StonetuskBoarModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Stonetusk Boar',
                desc: 'Charge',
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
                            child: {
                                charge: new ChargeModel({})
                            }
                        })
                    },
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}