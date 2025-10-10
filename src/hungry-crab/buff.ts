import { IRoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('hungry-crab-buff')
export class HungryCrabBuffModel extends IRoleBuffModel {
    constructor(props?: HungryCrabBuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Hungry Crab\'s Buff',
                desc: '+2/+2',
                offset: [2, 2],
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}