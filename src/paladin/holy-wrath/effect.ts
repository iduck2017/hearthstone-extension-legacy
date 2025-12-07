import { Selector, SpellEffectModel, RoleModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('holy-wrath-effect')
export class HolyWrathEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: HolyWrathEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Holy Wrath's effect",
                desc: "Draw a card and deal damage equal to its Cost.",
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

        const hand = player.child.hand;

        // Draw a card
        await hand.draw();

        // Get the drawn card (the last card in hand after drawing)
        const drawnCard = hand.child.cards[hand.child.cards.length - 1];
        if (drawnCard) {
            // Get the card's cost
            const cost = drawnCard.child.cost?.state.origin ?? 0;
            // Deal damage equal to the card's cost
            DamageModel.deal([
                new DamageEvent({
                    type: DamageType.SPELL,
                    source: card,
                    method: this,
                    target,
                    origin: cost
                })
            ]);
        }
    }
}

