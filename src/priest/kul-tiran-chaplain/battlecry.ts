import { BattlecryModel, Selector, RoleModel, BaseFeatureModel, RoleHealthBuffModel } from "hearthstone-core";
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
        
        // Apply +2 Health buff
        target.buff(new BaseFeatureModel({
            state: {
                name: "Kul Tiran Chaplain's Buff",
                desc: "+2 Health.",
            },
            child: {
                buffs: [new RoleHealthBuffModel({ state: { offset: 2 } })]
            },
        }));
    }
}
