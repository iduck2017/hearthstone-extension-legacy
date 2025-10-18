import { SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";


@TemplUtil.is('icicle-effect')
export class IcicleEffectModel extends SpellEffectModel<[RoleModel]> {
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

    toRun(): [SelectEvent<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true);
        return [new SelectEvent(roles, { hint: "Choose a minion" })]
    }

    protected async doRun(target: RoleModel) {
        const card = this.route.card;
        if (!card) return;
        const player = this.route.player;
        if (!player) return;
        
        // Deal 2 damage to the target
        await DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: this.state.damage[0] ?? 0
            })
        ])
        
        // Check if target is frozen
        const feats = target.child.feats;
        const frozen = feats.child.frozen;
        
        if (frozen.state.isActive) {
            // If frozen, draw a card
            const deck = player.child.deck;
            deck.draw();
        }
    }
}
