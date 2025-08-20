import { BuffModel } from "hearthstone-core";

export class LightwardenBuffModel extends BuffModel {
    constructor(props: LightwardenBuffModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Lightwarden\'s Buff',
                desc: '+2 Attack',
                offset: [2, 0],
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}