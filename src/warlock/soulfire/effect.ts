import { Selector, SpellEffectModel, RoleModel, DamageModel, DamageEvent, DamageType, CardModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('soulfire-effect')
export class SoulfireEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: SoulfireEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Soulfire's effect",
                desc: "Deal 4 damage. Discard a random card.",
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

        // Deal 4 damage to the target
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: 4,
            })
        ]);

        // Discard a random card from hand
        const hand = player.child.hand;
        const cards = hand.child.cards.filter(c => c !== card); // Exclude Soulfire itself
        if (cards.length > 0) {
            const index = Math.floor(Math.random() * cards.length);
            const cardToDiscard = cards[index];
            if (cardToDiscard) {
                // TODO: Implement discard mechanic
                // hand.drop(cardToDiscard); // Need to verify the correct method
            }
        }
    }
}

