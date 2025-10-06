import { RoleBuffModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('arcane-devourer-buff')
export class ArcaneDevourerBuffModel extends RoleBuffModel {
    constructor(loader?: Loader<ArcaneDevourerBuffModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Arcane Devourer\'s Buff',
                    desc: '+2/+2.',
                    offset: [2, 2],
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }
}
