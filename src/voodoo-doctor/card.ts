import { MinionCardModel, RaceType } from "hearthstone-core";
import { VoodooDoctorRoleModel } from "./role";

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
                role: new VoodooDoctorRoleModel({}),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}