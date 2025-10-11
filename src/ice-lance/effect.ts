import { SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";


@TemplUtil.is('ice-lance-effect')
export class IceLanceEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(props?: IceLanceEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Ice Lance's effect",
                desc: "Freeze a character. If it was already Frozen, deal {{state.damage[0]}} damage instead.",
                damage: [4],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
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