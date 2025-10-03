import { RoleBattlecryModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";
import { KirinTorMageContextModel } from "./context";

@StoreUtil.is('kirin-tor-mage-battlecry')
export class KirinTorMageBattlecryModel extends RoleBattlecryModel<[]> {
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
