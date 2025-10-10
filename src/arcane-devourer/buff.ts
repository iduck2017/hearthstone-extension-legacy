import { IRoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('arcane-devourer-buff')
export class ArcaneDevourerBuffModel extends IRoleBuffModel {
    constructor(props?: ArcaneDevourerBuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Arcane Devourer\'s Buff',
                desc: '+2/+2.',
                offset: [2, 2],
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}
