import { IRoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('divine-spirit-buff')
export class DivineSpiritBuffModel extends IRoleBuffModel {
    constructor(props?: DivineSpiritBuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Divine Spirit\'s Buff',
                desc: 'Double a minion\'s Health.',
                offset: [0, 0], // 0 Attack, +Health equal to current health
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}
