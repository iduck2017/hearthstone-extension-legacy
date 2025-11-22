import { Selector, RoleModel, DamageModel, DamageEvent, DamageType, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";


@TemplUtil.is('ice-lance-effect')
export class IceLanceEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: IceLanceEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Ice Lance's effect",
                desc: "Freeze a character. If it was already Frozen, deal {{spellDamage[0]}} damage instead.",
                damage: [4],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<RoleModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.refer.roles;
        return new Selector(roles, { hint: "Choose a target" })
    }

    public async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const card = this.route.card;
        if (!card) return;
        
        // Check if target is already frozen
        const frozen = target.child.frozen;
        
        if (frozen.state.isEnabled) {
            // If already frozen, deal 4 damage instead
            DamageModel.deal([
                new DamageEvent({
                    type: DamageType.SPELL,
                    source: card,
                    method: this,
                    target,
                    origin: this.state.damage[0] ?? 0,
                })
            ])
        } else {
            frozen.enable();
        }
    }
} 