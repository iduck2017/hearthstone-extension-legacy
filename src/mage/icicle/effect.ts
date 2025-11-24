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
                desc: "Deal *2* damage to a minion. If it's Frozen, draw a card.",
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<RoleModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.refer.roles.filter(role => role instanceof MinionCardModel);
        return new Selector(roles, { hint: "Choose a minion" })
    }

    public async doRun(params: Array<RoleModel | undefined>) {
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
                origin: 2
            })
        ])
        
        // Check if target is frozen
        const frozen = target.child.frozen;
        
        if (frozen.state.isEnabled) {
            // If frozen, draw a card
            const hand = player.child.hand;
            hand.draw();
        }
    }
}
