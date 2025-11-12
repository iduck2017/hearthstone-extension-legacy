import { DeathrattleModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { AegwynnTheGuardianContextModel } from "./context";

@TemplUtil.is('aegwynn-the-guardian-deathrattle')
export class AegwynnTheGuardianDeathrattleModel extends DeathrattleModel {
    constructor(props?: AegwynnTheGuardianDeathrattleModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Aegwynn\'s Deathrattle',
                desc: 'The next minion you draw inherits these powers.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // When Aegwynn dies, the next minion drawn will inherit Spell Damage +2
    public doRun() {
        const player = this.route.player;
        if (!player) return;
        player.add(new AegwynnTheGuardianContextModel())
    }
}
