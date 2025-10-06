import { MinionBattlecryModel, SelectEvent, RoleModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('spellbreaker-battlecry')
export class SpellbreakerBattlecryModel extends MinionBattlecryModel<[RoleModel]> {
    constructor(loader?: Loader<SpellbreakerBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Spellbreaker's Battlecry",
                    desc: "Silence a minion.",
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }

    public toRun(): [SelectEvent<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true); // Can only target minions
        return [new SelectEvent(roles, { hint: "Choose a minion to silence" })];
    }

    public async doRun(from: number, to: number, target: RoleModel) {
        // Silence the target minion
        const minion = target.route.minion;
        if (!minion) return;
        minion.silence();
    }
}
