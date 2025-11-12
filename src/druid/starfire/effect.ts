import { Selector, RoleModel, DamageModel, DamageEvent, DamageType, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('starfire-effect')
export class StarfireEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(props?: StarfireEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Starfire's effect",
                desc: "Deal {{spellDamage[0]}} damage. Draw a card.",
                damage: [5],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [Selector<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query();
        return [new Selector(roles, { hint: "Choose a target" })]
    }

    protected doRun(target: RoleModel) {
        const card = this.route.card;
        if (!card) return;
        const player = this.route.player;
        if (!player) return;
        
        // Deal 5 damage
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: this.state.damage[0] ?? 0
            })
        ]);
        
        // Draw a card
        const deck = player.child.deck;
        deck.draw();
    }
}

