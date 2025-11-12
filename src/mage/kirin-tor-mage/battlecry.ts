import { MinionBattlecryModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { KirinTorMageContextModel } from "./context";

@TemplUtil.is('kirin-tor-mage-battlecry')
export class KirinTorMageBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(props?: KirinTorMageBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Kirin Tor Mage Battlecry',
                desc: 'The next Secret you play this turn costs (0).',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toRun(): [] { return []; }

    public doRun(from: number, to: number) {
        const player = this.route.player;
        if (!player) return;
        player.add(new KirinTorMageContextModel());
    }
}
