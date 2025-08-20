import { BuffModel } from "hearthstone-core";

export class HungryCrabBuffModel extends BuffModel {
    constructor(props: HungryCrabBuffModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Hungry Crab\'s Buff',
                desc: '+2/+2',
                offset: [2, 2],
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}