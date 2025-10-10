import { EffectModel, SpellEffectModel, SelectEvent, RoleModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('shadow-word-death-effect')
export class ShadowWordDeathEffectModel extends SpellEffectModel<[RoleModel]> {
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

    toRun(): [SelectEvent<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        
        // Only target minions with 5 or more Attack
        const roles = games.query(true).filter(role => role.child.attack.state.current >= 5);
        if (roles.length === 0) return; // No valid targets
        
        return [new SelectEvent(roles, { hint: "Choose a minion with 5 or more Attack" })];
    }

    protected async doRun(target: RoleModel) {
        const minion = target.route.minion;
        if (!minion) return;
        // Check if the minion has 5 or more Attack
        if (minion.child.role.child.attack.state.current < 5) return;
        // Destroy the minion
        minion.child.dispose.active(true, this.route.card, this);
    }
}
