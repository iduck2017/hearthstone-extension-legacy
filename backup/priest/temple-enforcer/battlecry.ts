import { BattlecryModel, Selector, RoleModel, RoleBuffModel, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('temple-enforcer-battlecry')
export class TempleEnforcerBattlecryModel extends BattlecryModel<RoleModel> {
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

    public prepare(): Selector<RoleModel> | undefined {
        const player = this.route.player;
        if (!player) return;
        
        // Only target friendly minions
        const roles = player.refer.minions;
        if (roles.length === 0) return; // No valid targets
        
        return new Selector(roles, { hint: "Choose a friendly minion" });
    }

    public run(target: RoleModel) {
        const player = this.route.player;
        if (!player) return;
        
        // Check if the target is a friendly minion
        if (target.route.player !== player) return;
        
        // Apply +3 Health buff
        const buff = new RoleBuffModel({
            state: {
                name: "Temple Enforcer's Buff",
                desc: "+3 Health.",
                offset: [0, 3] // +0 Attack, +3 Health
            }
        });
        target.buff(buff);
    }
}
