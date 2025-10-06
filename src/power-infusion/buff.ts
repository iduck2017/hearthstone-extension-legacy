import { IRoleBuffModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('power-infusion-buff')
export class PowerInfusionBuffModel extends IRoleBuffModel {
    constructor(loader?: Loader<PowerInfusionBuffModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Power Infusion\'s Buff',
                    desc: '+2/+6.',
                    offset: [2, 6], // +2 Attack, +6 Health
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }
}
