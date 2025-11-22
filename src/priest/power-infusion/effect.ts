import { Selector, RoleModel, SpellEffectModel, RoleBuffModel, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('power-infusion-effect')
export class PowerInfusionEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: PowerInfusionEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Power Infusion's effect",
                desc: "Give a minion +2/+6.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<RoleModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        
        // Only target minions
        const roles = games.refer.minions;
        return new Selector(roles, { hint: "Choose a minion" });
    }

    public async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        // Give the minion +2/+6 buff
        const buff = new RoleBuffModel({
            state: {
                name: "Power Infusion's Buff",
                desc: "+2/+6.",
                offset: [2, 6] // +2 Attack, +6 Health
            }
        });
        target.buff(buff);
    }
}
