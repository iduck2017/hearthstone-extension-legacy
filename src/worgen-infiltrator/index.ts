import { AttackModel, ClassType, HealthModel, MinionModel, RarityType, RoleEntriesModel, RoleModel, StealthModel } from "hearthstone-core";

export class WorgenInfiltratorModel extends MinionModel {
    constructor(props: WorgenInfiltratorModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Worgen Infiltrator',
                desc: 'Stealth',
                mana: 1,
                races: [],
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 1 }}),
                        entries: new RoleEntriesModel({
                            child: { stealth: new StealthModel({}) }
                        })
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}