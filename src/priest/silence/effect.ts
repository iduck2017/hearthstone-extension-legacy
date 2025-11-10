import { EffectModel, Selector, RoleModel, SpellEffectModel, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('silence-effect')
export class SilenceEffectModel extends SpellEffectModel<[MinionCardModel]> {
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

    toRun(): [Selector<MinionCardModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true); // Only minions can be targeted
        return [new Selector(roles, { hint: "Choose a minion" })];
    }

    protected async doRun(target: MinionCardModel) {
        target.silence();
    }
}
