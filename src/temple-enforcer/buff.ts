import { IRoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('temple-enforcer-buff')
export class TempleEnforcerBuffModel extends IRoleBuffModel {
    constructor(props?: TempleEnforcerBuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Temple Enforcer\'s Buff',
                desc: '+3 Health.',
                offset: [0, 3], // +0 Attack, +3 Health
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}
