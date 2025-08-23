import { HealthModel, AttackModel, MinionModel, RaceType, RoleModel, CardHooksModel, ClassType, RarityType } from "hearthstone-core";
import { HungryCrabBattlecryModel } from "./battlecry";

export class HungryCrabModel extends MinionModel {
    constructor(props: HungryCrabModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Hungry Crab',
                desc: 'Battlecry: Destroy a Murloc and gain +2/+2.',
                mana: 1,
                races: [RaceType.BEAST],
                flavorDesc: '',
                rarity: RarityType.EPIC,
                class: ClassType.NEUTRAL,
                ...props.state
            },
            child: {
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 2 }}),   
                    }
                }),
                hooks: new CardHooksModel({
                    child: {
                        battlecry: [ new HungryCrabBattlecryModel({}) ]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}