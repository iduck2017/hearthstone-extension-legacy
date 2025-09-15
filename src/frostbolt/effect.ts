import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('frostbolt-effect')
export class FrostboltEffectModel extends EffectModel<[RoleModel]> {
    constructor(loader?: Loader<FrostboltEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Frostbolt's effect",
                    desc: "Deal 3 damage to a character and Freeze it.",
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
        
        // Deal 3 damage to the target
        await DamageModel.run([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                detail: this,
                target,
                origin: 3
            })
        ])
        
        // Freeze the target
        const entries = target.child.entries;
        const frozen = entries.child.frozen;
        frozen.active();
    }
} 