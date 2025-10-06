import { EffectModel, SpellEffectModel, SelectEvent, RoleModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";
import { DivineSpiritBuffModel } from "./buff";

@StoreUtil.is('divine-spirit-effect')
export class DivineSpiritEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(loader?: Loader<DivineSpiritEffectModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Divine Spirit's effect",
                    desc: "Double a minion's Health.",
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
        
        // Only target minions
        const roles = games.query(true);
        if (roles.length === 0) return; // No valid targets
        
        return [new SelectEvent(roles, { hint: "Choose a minion" })];
    }

    protected async doRun(target: RoleModel) {
        const minion = target.route.minion;
        if (!minion) return;
        
        // Get current health and create a buff with equal value
        const currentHealth = target.child.health.state.current;
        const buff = new DivineSpiritBuffModel(() => ({ state: { offset: [0, currentHealth] }}));
        target.child.entries.add(buff);
    }
}
