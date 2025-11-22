import { EffectModel, SpellEffectModel, Selector, RoleModel, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('shadow-word-pain-effect')
export class ShadowWordPainEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: ShadowWordPainEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Shadow Word: Pain's effect",
                desc: "Destroy a minion with 3 or less Attack.",
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
        
        // Only target minions with 3 or less Attack
        const roles = games.refer.roles.filter(role => role instanceof MinionCardModel && role.child.attack.state.current <= 3);
        if (roles.length === 0) return; // No valid targets
        
        return new Selector(roles, { hint: "Choose a minion with 3 or less Attack" });
    }

    public async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        if (target.child.attack.state.current > 3) return;
        // Destroy the minion
        target.child.dispose.destroy(this.route.card, this);
    }
}
