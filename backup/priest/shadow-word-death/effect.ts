import { EffectModel, SpellEffectModel, Selector, RoleModel, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('shadow-word-death-effect')
export class ShadowWordDeathEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: ShadowWordDeathEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Shadow Word: Death's effect",
                desc: "Destroy a minion with 5 or more Attack.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public prepare(): Selector<RoleModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        
        // Only target minions with 5 or more Attack
        const roles = games.refer.roles.filter(role => role instanceof MinionCardModel && role.child.attack.state.current >= 5);
        if (roles.length === 0) return; // No valid targets
        
        return new Selector(roles, { hint: "Choose a minion with 5 or more Attack" });
    }

    protected run(target: RoleModel) {
        // Check if the minion has 5 or more Attack
        if (target.child.attack.state.current < 5) return;
        // Destroy the minion
        target.child.dispose.active(true, this.route.card, this);
    }
}
