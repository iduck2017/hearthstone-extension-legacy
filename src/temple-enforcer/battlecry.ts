import { RoleBattlecryModel, SelectEvent, RoleModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";
import { TempleEnforcerBuffModel } from "./buff";

@StoreUtil.is('temple-enforcer-battlecry')
export class TempleEnforcerBattlecryModel extends RoleBattlecryModel<[RoleModel]> {
    constructor(loader?: Loader<TempleEnforcerBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Temple Enforcer's Battlecry",
                    desc: "Give a friendly minion +3 Health.",
                    ...props.state
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
        
        // Apply +3 Health buff
        const buff = new TempleEnforcerBuffModel();
        target.add(buff);
    }
}
