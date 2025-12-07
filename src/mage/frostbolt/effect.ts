import { Selector, RoleModel, DamageModel, DamageEvent, DamageType, SpellEffectModel, FrozenModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";


@TemplUtil.is('frostbolt-effect')
export class FrostboltEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: FrostboltEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Frostbolt's effect",
                desc: "Deal *3* damage to a character and Freeze it.",
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    precheck(): Selector<RoleModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.refer.roles;
        return new Selector(roles, { hint: "Choose a target" })
    }

    protected async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const card = this.route.card;
        if (!card) return;
        
        // Deal 3 damage to the target
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: 3
            })
        ])
        // Freeze the target
        FrozenModel.enable([target]);
    }
} 