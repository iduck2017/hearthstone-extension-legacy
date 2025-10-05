import { RoleBuffModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('temple-enforcer-buff')
export class TempleEnforcerBuffModel extends RoleBuffModel {
    constructor(loader?: Loader<TempleEnforcerBuffModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Temple Enforcer\'s Buff',
                    desc: '+3 Health.',
                    offset: [0, 3], // +0 Attack, +3 Health
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }
}
