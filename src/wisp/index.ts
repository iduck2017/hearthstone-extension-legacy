import { AttackModel, ClassType, CostModel, HealthModel, MinionModel, RaceType, RarityType, RoleModel } from "hearthstone-core";
import { StoreUtil } from "set-piece";

@StoreUtil.is('wisp-card')
export class WispModel extends MinionModel {
    constructor(props: WispModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Wisp',
                desc: '',
                races: [RaceType.UNDEAD],
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: { 
                cost: new CostModel({ state: { origin: 0 }}),
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 1 }}),
                    },
                }),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }
}
