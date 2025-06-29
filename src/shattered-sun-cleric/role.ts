import { MinionRoleModel } from "hearthstone-core";

export class ShatteredSunClericRoleModel extends MinionRoleModel {
    constructor(props: ShatteredSunClericRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                attack: 3,
                health: 2,
                races: [],
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}