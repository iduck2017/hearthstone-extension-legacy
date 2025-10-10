import { MinionBattlecryModel } from "hearthstone-core";
import { Loader, TemplUtil } from "set-piece";
import { KirinTorMageContextModel } from "./context";

@TemplUtil.is('kirin-tor-mage-battlecry')
export class KirinTorMageBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(loader?: Loader<KirinTorMageBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Kirin Tor Mage Battlecry',
                    desc: 'The next Secret you play this turn costs (0).',
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    public toRun(): [] { return []; }

    public async doRun(from: number, to: number) {
        const player = this.route.player;
        if (!player) return;
        player.add(new KirinTorMageContextModel());
    }
}
