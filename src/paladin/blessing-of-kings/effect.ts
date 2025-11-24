import { Selector, SpellEffectModel, MinionCardModel, BaseFeatureModel, RoleAttackBuffModel, RoleHealthBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('blessing-of-kings-effect')
export class BlessingOfKingsEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: BlessingOfKingsEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Blessing of Kings's effect",
                desc: "Give a minion +4/+4.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<MinionCardModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.minions;
        return new Selector(roles, { hint: "Choose a minion" });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;

        // Give the minion +4/+4 buff
        target.buff(new BaseFeatureModel({
            state: {
                name: "Blessing of Kings's Buff",
                desc: "+4/+4.",
            },
            child: {
                buffs: [
                    new RoleAttackBuffModel({ state: { offset: 4 } }),
                    new RoleHealthBuffModel({ state: { offset: 4 } })
                ]
            },
        }));
    }
}

