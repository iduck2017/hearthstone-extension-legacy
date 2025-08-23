import { AttackModel, HealthModel, MinionCardModel, RaceType, RoleModel } from "hearthstone-core";
import { StoreUtil } from "set-piece";

@StoreUtil.is('wisp-card')
export class WispCardModel extends MinionCardModel {
    constructor(props: WispCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Wisp',
                desc: '',
                mana: 0,
                races: [RaceType.UNDEAD],
                ...props.state,
            },
            child: { 
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
