import { ChargeModel, HealthModel, AttackModel, MinionModel, RaceType, RoleModel, RoleEntriesModel, ClassType, RarityType } from "hearthstone-core";

export class StonetuskBoarModel extends MinionModel {
    constructor(props: StonetuskBoarModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Stonetusk Boar',
                desc: 'Charge',
                mana: 1,
                races: [RaceType.BEAST],
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
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