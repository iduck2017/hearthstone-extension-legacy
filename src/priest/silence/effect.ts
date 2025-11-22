import { EffectModel, Selector, RoleModel, SpellEffectModel, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('silence-effect')
export class SilenceEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: SilenceEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Silence's effect",
                desc: "Silence a minion.",
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
        const roles = games.refer.roles.filter(role => role instanceof MinionCardModel);
        return new Selector(roles, { hint: "Choose a minion" });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;
        target.silence();
    }
}
