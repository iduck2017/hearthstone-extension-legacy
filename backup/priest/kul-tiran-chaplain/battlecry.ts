import { BattlecryModel, Selector, RoleModel, RoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('kul-tiran-chaplain-battlecry')
export class KulTiranChaplainBattlecryModel extends BattlecryModel<RoleModel> {
    constructor(props?: KulTiranChaplainBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Kul Tiran Chaplain\'s Battlecry',
                desc: 'Give a friendly minion +2 Health.',
                ...props.state,
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
        
        // Apply +2 Health buff
        const buff = new RoleBuffModel({
            state: {
                name: "Kul Tiran Chaplain's Buff",
                desc: "+2 Health.",
                offset: [0, 2] // +0 Attack, +2 Health
            }
        });
        target.buff(buff);
    }
}
