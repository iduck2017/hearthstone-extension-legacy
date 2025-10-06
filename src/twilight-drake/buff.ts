import { IRoleBuffModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('twilight-drake-buff')
export class TwilightDrakeBuffModel extends IRoleBuffModel {
    constructor(loader?: Loader<TwilightDrakeBuffModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Twilight Drake's Health Buff",
                    desc: "Gain +1 Health for each card in your hand.",
                    offset: [0, 0], // Default offset, will be overridden
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }
}
