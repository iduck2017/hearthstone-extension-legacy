import { AttackModel, CardHooksModel, ClassType, HealthModel, MinionModel,RarityType,  RaceType, RoleModel, CardModel } from "hearthstone-core";
import { VoodooDoctorBattlecryModel } from "./battlecry";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('voodoo-doctor')
export class VoodooDoctorModel extends CardModel {
    constructor(props: VoodooDoctorModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Voodoo Doctor',
                desc: 'Battlecry: Restore 2 Health.',
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                minion: new MinionModel({
                    state: { races: [] },
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