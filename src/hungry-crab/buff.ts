import { BuffModel } from "hearthstone-core";

export class HungryCrabBuffModel extends BuffModel {
    constructor(props: HungryCrabBuffModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Hungry Crab\'s Buff',
                desc: '+2/+2',
                attack: 2,
                health: 2,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}