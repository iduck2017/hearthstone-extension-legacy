import { EffectModel, SpellEffectModel, SelectEvent, RoleModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('shadow-word-pain-effect')
export class ShadowWordPainEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(loader?: Loader<ShadowWordPainEffectModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Shadow Word: Pain's effect",
                    desc: "Destroy a minion with 3 or less Attack.",
                    damage: [],
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }

    toRun(): [SelectEvent<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        
        // Only target minions with 3 or less Attack
        const roles = games.query(true).filter(role => role.child.attack.state.current <= 3);
        if (roles.length === 0) return; // No valid targets
        
        return [new SelectEvent(roles, { hint: "Choose a minion with 3 or less Attack" })];
    }

    protected async doRun(target: RoleModel) {
        const minion = target.route.minion;
        if (!minion) return;
        if (target.child.attack.state.current > 3) return;
        // Destroy the minion
        minion.child.dispose.active(true, this.route.card, this);
    }
}
