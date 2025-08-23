import { AttackModel, CardHooksModel, ClassType, HealthModel, MinionModel,RarityType,  RaceType, RoleModel } from "hearthstone-core";
import { VoodooDoctorBattlecryModel } from "./battlecry";
import { CostModel } from "hearthstone-core";

export class VoodooDoctorModel extends MinionModel {
    constructor(props: VoodooDoctorModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Voodoo Doctor',
                desc: 'Battlecry: Restore 2 Health.',
                races: [],
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                role: new RoleModel({
                    child: {
                        attack: new AttackModel({ state: { origin: 2 }}),
                        health: new HealthModel({ state: { origin: 1 }}),
                    },
                }),
                hooks: new CardHooksModel({
                    child: {
                        battlecry: [new VoodooDoctorBattlecryModel({})]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}