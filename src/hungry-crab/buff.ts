import { BuffModel } from "hearthstone-core";
import { StoreUtil, Loader } from "set-piece";

@StoreUtil.is('hungry-crab-buff')
export class HungryCrabBuffModel extends BuffModel {
    constructor(loader?: Loader<HungryCrabBuffModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Hungry Crab\'s Buff',
                    desc: '+2/+2',
                    offsetAttack: 2,
                    offsetHealth: 2,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }
}