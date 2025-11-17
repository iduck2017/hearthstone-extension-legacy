import { Selector, RoleModel, DamageModel, DamageEvent, DamageType, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";


@TemplUtil.is('frostbolt-effect')
export class FrostboltEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: FrostboltEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Frostbolt's effect",
                desc: "Deal {{spellDamage[0]}} damage to a character and Freeze it.",
                damage: [3],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    prepare(): Selector<RoleModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.refer.roles;
        return new Selector(roles, { hint: "Choose a target" })
    }

    protected run(target: RoleModel) {
        const card = this.route.card;
        if (!card) return;
        
        // Deal 3 damage to the target
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: this.state.damage[0] ?? 0
            })
        ])
        
        // Freeze the target
        const frozen = target.child.frozen;
        frozen.active();
    }
} 