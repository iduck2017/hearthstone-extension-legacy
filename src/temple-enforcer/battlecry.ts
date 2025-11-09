import { MinionBattlecryModel, Selector, RoleModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { TempleEnforcerBuffModel } from "./buff";

@TemplUtil.is('temple-enforcer-battlecry')
export class TempleEnforcerBattlecryModel extends MinionBattlecryModel<[RoleModel]> {
    constructor(props?: TempleEnforcerBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Temple Enforcer's Battlecry",
                desc: "Give a friendly minion +3 Health.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toRun(): [Selector<RoleModel>] | undefined {
        const player = this.route.player;
        if (!player) return;
        
        // Only target friendly minions
        const roles = player.query(true);
        if (roles.length === 0) return; // No valid targets
        
        return [new Selector(roles, { hint: "Choose a friendly minion" })];
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
        target.child.feats.add(buff);
    }
}
