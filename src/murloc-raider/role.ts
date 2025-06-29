import { MinionRoleModel, MinionRaceType } from "hearthstone-core";

export class MurlocRaiderRoleModel extends MinionRoleModel {
    constructor(props: MurlocRaiderRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                attack: 2,
                health: 1,
                races: [MinionRaceType.MURLOC],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        });
    }
}