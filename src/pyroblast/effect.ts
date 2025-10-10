import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType, SpellEffectModel } from "hearthstone-core";
import { Loader, TemplUtil } from "set-piece";

@TemplUtil.is('pyroblast-effect')
export class PyroblastEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(loader?: Loader<PyroblastEffectModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Pyroblast's effect",
                    desc: "Deal {{state.damage[0]}} damage.",
                    damage: [10],
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
        const roles = games.query(); // Can target any character
        return [new SelectEvent(roles, { hint: "Choose a target" })];
    }

    protected async doRun(target: RoleModel) {
        const card = this.route.card;
        if (!card) return;

        // Deal 10 damage to the target
        await DamageModel.run([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: this.state.damage[0] ?? 0,
            })
        ]);
    }
}
