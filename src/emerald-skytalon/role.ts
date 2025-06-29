import { MinionRoleModel, MinionRaceType } from "hearthstone-core";

export class EmeraldSkytalonRoleModel extends MinionRoleModel {
    constructor(props: EmeraldSkytalonRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                attack: 2,
                health: 1,
                races: [MinionRaceType.BEAST, MinionRaceType.ELEMENTAL],
                isRush: true,
                action: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }
}