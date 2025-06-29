import { RoleModel, MinionRoleModel } from "hearthstone-core";

export class ArgentSquireRoleModel extends MinionRoleModel {
    public constructor(props: RoleModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                attack: 1,
                health: 1,
                isShield: true,
                races: [],
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}