import { BattlecryModel, Selector } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { KirinTorMageContextModel } from "./context";

@TemplUtil.is('kirin-tor-mage-battlecry')
export class KirinTorMageBattlecryModel extends BattlecryModel<never> {
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

    public prepare(...prev: never[]): Selector<never> | undefined {
        return undefined
    }

    public run(params: never[]) {
        const player = this.route.player;
        if (!player) return;
        player.buff(new KirinTorMageContextModel());
    }
}
