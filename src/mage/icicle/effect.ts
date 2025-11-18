import { Selector, RoleModel, DamageModel, DamageEvent, DamageType, SpellEffectModel, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";


@TemplUtil.is('icicle-effect')
export class IcicleEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: IcicleEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Icicle's effect",
                desc: "Deal {{spellDamage[0]}} damage to a minion. If it's Frozen, draw a card.",
                damage: [2],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    prepare(): Selector<RoleModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.refer.roles.filter(role => role instanceof MinionCardModel);
        return new Selector(roles, { hint: "Choose a minion" })
    }

    protected run(params: RoleModel[]) {
        const target = params[0];
        if (!target) return;
        const card = this.route.card;
        if (!card) return;
        const player = this.route.player;
        if (!player) return;
        
        // Deal 2 damage to the target
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: this.state.damage[0] ?? 0
            })
        ])
        
        // Check if target is frozen
        const frozen = target.child.frozen;
        
        if (frozen.state.actived) {
            // If frozen, draw a card
            const deck = player.child.deck;
            deck.draw();
        }
    }
}
