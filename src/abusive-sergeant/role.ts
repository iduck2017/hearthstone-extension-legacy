import { MinionRoleModel } from "hearthstone-core";

export class AbusiveSergeantRoleModel extends MinionRoleModel {
    constructor(props: AbusiveSergeantRoleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                attack: 2,
                health: 1,
                races: [],
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        }); 
    }
}