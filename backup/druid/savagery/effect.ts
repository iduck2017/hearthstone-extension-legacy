import { Selector, RoleModel, DamageModel, DamageEvent, DamageType, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('savagery-effect')
export class SavageryEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(props?: SavageryEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Savagery's effect",
                desc: "Deal damage equal to your hero's Attack to a minion.",
                damage: [0],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [Selector<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true);
        return [new Selector(roles, { hint: "Choose a minion" })]
    }

    protected doRun(target: RoleModel) {
        const player = this.route.player;
        if (!player) return;
        const hero = player.child.hero;
        const card = this.route.card;
        if (!card) return;
        
        // Get hero's current attack
        const attack = hero.child.attack.state.current;
        
        // Get spell damage bonus (this.state.damage[0] includes spell damage bonus)
        const bonus = this.state.damage[0] ?? 0;
        
        // Deal damage equal to hero's attack + spell damage bonus
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: attack + bonus
            })
        ])
    }
}

