import { MinionBattlecryModel, SelectEvent, RoleModel } from "hearthstone-core";
import { Loader, TemplUtil } from "set-piece";
import { KulTiranChaplainBuffModel } from "./buff";

@TemplUtil.is('kul-tiran-chaplain-battlecry')
export class KulTiranChaplainBattlecryModel extends MinionBattlecryModel<[RoleModel]> {
    constructor(loader?: Loader<KulTiranChaplainBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Kul Tiran Chaplain\'s Battlecry',
                    desc: 'Give a friendly minion +2 Health.',
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }

    public toRun(): [SelectEvent<RoleModel>] | undefined {
        const player = this.route.player;
        if (!player) return;
        
        // Only target friendly minions
        const roles = player.query(true);
        if (roles.length === 0) return; // No valid targets
        
        return [new SelectEvent(roles, { hint: "Choose a friendly minion" })];
    }

    public async doRun(from: number, to: number, target: RoleModel) {
        const player = this.route.player;
        if (!player) return;
        
        // Check if the target is a friendly minion
        const minion = target.route.minion;
        if (!minion) return;
        if (minion.route.player !== player) return;
        
        // Apply +2 Health buff
        const buff = new KulTiranChaplainBuffModel();
        target.child.feats.add(buff);
    }
}
