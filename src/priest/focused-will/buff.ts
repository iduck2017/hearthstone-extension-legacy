import { IRoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('focused-will-buff')
export class FocusedWillBuffModel extends IRoleBuffModel {
    constructor(props?: FocusedWillBuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Focused Will\'s Buff',
                desc: '+3 Health.',
                offset: [0, 3], // +0 Attack, +3 Health
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}
