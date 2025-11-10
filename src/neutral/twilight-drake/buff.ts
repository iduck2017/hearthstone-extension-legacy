import { IRoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('twilight-drake-buff')
export class TwilightDrakeBuffModel extends IRoleBuffModel {
    constructor(props?: TwilightDrakeBuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Twilight Drake's Health Buff",
                desc: "Gain +1 Health for each card in your hand.",
                offset: [0, 0], // Default offset, will be overridden
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}
