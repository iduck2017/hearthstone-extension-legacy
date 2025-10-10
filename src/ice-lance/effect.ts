import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType, RoleRoute, ROLE_ROUTE, CARD_ROUTE, CardRoute, SpellEffectModel } from "hearthstone-core";
import { Loader, TemplUtil } from "set-piece";

export namespace IceLanceEffectProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@TemplUtil.is('ice-lance-effect')
export class IceLanceEffectModel extends SpellEffectModel<[RoleModel],
    IceLanceEffectProps.E,
    IceLanceEffectProps.S,
    IceLanceEffectProps.C,
    IceLanceEffectProps.R
> {
    constructor(loader?: Loader<IceLanceEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Ice Lance's effect",
                    desc: "Freeze a character. If it was already Frozen, deal {{state.damage[0]}} damage instead.",
                    damage: [4],
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        })
    }

    toRun(): [SelectEvent<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query();
        return [new SelectEvent(roles, { hint: "Choose a target" })]
    }

    protected async doRun(target: RoleModel) {
        const card = this.route.card;
        if (!card) return;
        
        // Check if target is already frozen
        const feats = target.child.feats;
        const frozen = feats.child.frozen;
        
        if (frozen.state.isActive) {
            // If already frozen, deal 4 damage instead
            await DamageModel.run([
                new DamageEvent({
                    type: DamageType.SPELL,
                    source: card,
                    method: this,
                    target,
                    origin: this.state.damage[0] ?? 0,
                })
            ])
        } else frozen.active();
    }
} 