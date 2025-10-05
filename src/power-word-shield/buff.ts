import { RoleBuffModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('power-word-shield-buff')
export class PowerWordShieldBuffModel extends RoleBuffModel {
    constructor(loader?: Loader<PowerWordShieldBuffModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Power Word: Shield\'s Buff',
                    desc: '+2 Health.',
                    offset: [0, 2], // +0 Attack, +2 Health
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }
}
