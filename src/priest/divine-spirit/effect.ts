import { EffectModel, SpellEffectModel, Selector, RoleModel, MinionCardModel, RoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('divine-spirit-effect')
export class DivineSpiritEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: DivineSpiritEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Divine Spirit's effect",
                desc: "Double a minion's Health.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<MinionCardModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        
        // Only target minions
        const roles = games.refer.minions;
        return new Selector(roles, { hint: "Choose a minion" });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;
        // Get current health and create a buff with equal value
        const currentHealth = target.child.health.state.current;
        const buff = new RoleBuffModel({
            state: {
                name: "Divine Spirit's Buff",
                desc: "Double a minion's Health.",
                offset: [0, currentHealth]
            }
        });
        target.buff(buff);
    }
}
