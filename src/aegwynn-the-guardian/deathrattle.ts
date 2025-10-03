import { DeathrattleModel, MinionCardModel, SpellBuffModel, RoleEntriesModel } from "hearthstone-core";
import { StoreUtil, Loader } from "set-piece";
import { AegwynnTheGuardianContextModel } from "./context";

@StoreUtil.is('aegwynn-the-guardian-deathrattle')
export class AegwynnTheGuardianDeathrattleModel extends DeathrattleModel {
    constructor(loader?: Loader<AegwynnTheGuardianDeathrattleModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Aegwynn\'s Deathrattle',
                    desc: 'The next minion you draw inherits these powers.',
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        });
    }

    // When Aegwynn dies, the next minion drawn will inherit Spell Damage +2
    public async doRun() {
        const player = this.route.player;
        if (!player) return;
        player.add(new AegwynnTheGuardianContextModel())
    }
}
