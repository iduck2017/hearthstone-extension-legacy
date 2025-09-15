import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('ice-lance-effect')
export class IceLanceEffectModel extends EffectModel<[RoleModel]> {
    constructor(loader?: Loader<IceLanceEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Ice Lance's effect",
                    desc: "Freeze a character. If it was already Frozen, deal 4 damage instead.",
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer } 
            }
        })
    }

    toRun(): [SelectEvent<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.refer.roles;
        return [new SelectEvent(roles, { hint: "Choose a target" })]
    }

    protected async doRun(target: RoleModel) {
        const card = this.route.card;
        if (!card) return;
        
        // Check if target is already frozen
        const entries = target.child.entries;
        const frozen = entries.child.frozen;
        
        if (frozen.state.isActive) {
            // If already frozen, deal 4 damage instead
            await DamageModel.run([
                new DamageEvent({
                    type: DamageType.SPELL,
                    source: card,
                    detail: this,
                    target,
                    origin: 4
                })
            ])
        } else frozen.active();
    }
} 