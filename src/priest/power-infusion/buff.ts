import { IRoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('power-infusion-buff')
export class PowerInfusionBuffModel extends IRoleBuffModel {
    constructor(props?: PowerInfusionBuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Power Infusion\'s Buff',
                desc: '+2/+6.',
                offset: [2, 6], // +2 Attack, +6 Health
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}
