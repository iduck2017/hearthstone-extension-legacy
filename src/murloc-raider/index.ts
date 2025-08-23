import { HealthModel, AttackModel, MinionModel, RaceType, RoleModel, RarityType, ClassType } from "hearthstone-core";
import { CostModel } from "hearthstone-core";

export class MurlocRaiderCard extends MinionModel {
    constructor(props: MurlocRaiderCard['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Raider',
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