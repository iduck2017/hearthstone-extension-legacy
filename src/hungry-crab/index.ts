import { HealthModel, AttackModel, MinionModel, RaceType, RoleModel, CardHooksModel, ClassType, RarityType, CardModel } from "hearthstone-core";
import { HungryCrabBattlecryModel } from "./battlecry";
import { CostModel } from "hearthstone-core";

export class HungryCrabModel extends CardModel {
    constructor(props: HungryCrabModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Hungry Crab',
                desc: 'Battlecry: Destroy a Murloc and gain +2/+2.',
                flavorDesc: '',
                rarity: RarityType.EPIC,
                class: ClassType.NEUTRAL,
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.BEAST] },
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