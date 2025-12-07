import { EffectModel, Selector, RoleModel, SpellEffectModel, MinionCardModel, BaseFeatureModel, RoleHealthBuffModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('focused-will-effect')
export class FocusedWillEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: FocusedWillEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Focused Will's effect",
                desc: "Silence a minion, then give it +3 Health.",
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
        // First, silence the minion
        target.silence();

        // Then, give it +3 Health buff
        target.buff(new BaseFeatureModel({
            state: {
                name: "Focused Will's Buff",
                desc: "+3 Health.",
            },
            child: {
                buffs: [new RoleHealthBuffModel({ state: { offset: 3 } })]
            },
        }));
    }
}
