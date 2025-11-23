import { BattlecryModel, Selector, RoleModel, BaseFeatureModel, RoleHealthBuffModel, MinionCardModel } from "hearthstone-core";
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

    public precheck(): Selector<RoleModel> | undefined {
        const player = this.route.player;
        if (!player) return;
        
        // Only target friendly minions
        const roles = player.refer.minions;
        return new Selector(roles, { hint: "Choose a friendly minion" });
    }

    public async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const player = this.route.player;
        if (!player) return;
        
        // Check if the target is a friendly minion
        if (target.route.player !== player) return;
        
        // Apply +3 Health buff
        target.buff(new BaseFeatureModel({
            state: {
                name: "Temple Enforcer's Buff",
                desc: "+3 Health.",
            },
            child: {
                buffs: [new RoleHealthBuffModel({ state: { offset: 3 } })]
            },
        }));
    }
}
