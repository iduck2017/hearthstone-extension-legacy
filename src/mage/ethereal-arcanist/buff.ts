import { IRoleBuffModel } from "hearthstone-core";

export class EtherealArcanistBuffModel extends IRoleBuffModel {
    constructor(props?: EtherealArcanistBuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Ethereal Arcanist\'s Buff',
                desc: '+2/+2.',
                offset: [2, 2],
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}