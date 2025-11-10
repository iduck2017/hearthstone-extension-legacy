import { IRoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('kul-tiran-chaplain-buff')
export class KulTiranChaplainBuffModel extends IRoleBuffModel {
    constructor(props?: KulTiranChaplainBuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Kul Tiran Chaplain\'s Buff',
                desc: '+2 Health.',
                offset: [0, 2], // 0 Attack, +2 Health
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}
