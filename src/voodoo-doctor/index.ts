import { AttackModel, CardHooksModel, HealthModel, MinionCardModel, RaceType, RoleModel } from "hearthstone-core";
import { VoodooDoctorBattlecryModel } from "./battlecry";

export class VoodooDoctorCardModel extends MinionCardModel {
    constructor(props: VoodooDoctorCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Voodoo Doctor',
                desc: 'Battlecry: Restore 2 Health.',
                mana: 1,
                races: [],
                ...props.state,
            },
            child: {
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