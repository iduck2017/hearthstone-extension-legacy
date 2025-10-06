import { IRoleBuffModel } from "hearthstone-core";
import { Loader } from "set-piece";

export class EtherealArcanistBuffModel extends IRoleBuffModel {
    constructor(loader?: Loader<EtherealArcanistBuffModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Ethereal Arcanist\'s Buff',
                    desc: '+2/+2.',
                    offset: [2, 2],
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }
}