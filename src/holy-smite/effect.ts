import { EffectModel, SelectEvent, RoleModel, SpellEffectModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('holy-smite-effect')
export class HolySmiteEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(loader?: Loader<HolySmiteEffectModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Holy Smite's effect",
                    desc: "Deal {{state.damage[0]}} damage to a minion.",
                    damage: [3],
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
        const roles = games.query(true); // Only minions can be targeted
        return [new SelectEvent(roles, { hint: "Choose a minion" })];
    }

    protected async doRun(target: RoleModel) {
        const card = this.route.card;
        if (!card) return;

        // Deal 3 damage to the target minion
        await DamageModel.run([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: this.state.damage[0] ?? 0
            })
        ]);
    }
}
