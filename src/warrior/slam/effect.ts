import { Selector, SpellEffectModel, MinionCardModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('slam-effect')
export class SlamEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: SlamEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Slam's effect",
                desc: "Deal *2* damage to a minion. If it survives, draw a card.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<MinionCardModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.minions;
        return new Selector(roles, { hint: "Choose a minion" });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const card = this.route.card;
        if (!card) return;
        const player = this.route.player;
        if (!player) return;

        // Deal 2 damage to the target minion
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: 2,
            })
        ]);

        // Check if the minion survives (not disposed)
        const dispose = target.child.dispose
        if (!dispose.state.isActived) {
            // If it survives, draw a card
            const hand = player.child.hand;
            hand.draw();
        }
    }
}

