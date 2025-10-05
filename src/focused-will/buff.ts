import { RoleBuffModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('focused-will-buff')
export class FocusedWillBuffModel extends RoleBuffModel {
    constructor(loader?: Loader<FocusedWillBuffModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Focused Will\'s Buff',
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
