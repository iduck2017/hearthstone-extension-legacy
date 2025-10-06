import { IRoleBuffModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('kul-tiran-chaplain-buff')
export class KulTiranChaplainBuffModel extends IRoleBuffModel {
    constructor(loader?: Loader<KulTiranChaplainBuffModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Kul Tiran Chaplain\'s Buff',
                    desc: '+2 Health.',
                    offset: [0, 2], // 0 Attack, +2 Health
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }
}
