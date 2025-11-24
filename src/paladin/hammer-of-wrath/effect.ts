import { Selector, SpellEffectModel, RoleModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('hammer-of-wrath-effect')
export class HammerOfWrathEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: HammerOfWrathEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Hammer of Wrath's effect",
                desc: "Deal *3* damage. Draw a card.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<RoleModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.roles;
        return new Selector(roles, { hint: "Choose a target" });
    }

    public async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const card = this.route.card;
        if (!card) return;
        const player = this.route.player;
        if (!player) return;

        // Deal 3 damage to the target
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: 3,
            })
        ]);

        // Draw a card
        const hand = player.child.hand;
        hand.draw();
    }
}

