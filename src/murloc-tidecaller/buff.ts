import { BuffModel } from "hearthstone-core";
import { StoreUtil } from "set-piece";

@StoreUtil.is('murloc-tidecaller-buff')
export class MurlocTidecallerBuffModel extends BuffModel {
    constructor(props: MurlocTidecallerBuffModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Tidecaller\'s Buff',
                desc: '+1 Attack',
                attack: 1,
                health: 0,
            },
            child: {},
            refer: {}
        });
    }
}