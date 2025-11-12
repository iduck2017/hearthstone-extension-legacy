import { Selector, RoleModel, SpellEffectModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('holy-wrath-effect')
export class HolyWrathEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(props?: HolyWrathEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Holy Wrath's effect",
                desc: "Draw a card and deal damage equal to its Cost.",
                damage: [],
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
        const player = this.route.player;
        if (!player) return;
        const card = this.route.card;
        if (!card) return;
        
        const deck = player.child.deck;
        const drawnCard = deck.draw();
        
        if (drawnCard) {
            const cardCost = drawnCard.child.cost?.state.origin ?? 0;
            DamageModel.deal([
                new DamageEvent({
                    type: DamageType.SPELL,
                    source: card,
                    method: this,
                    target,
                    origin: cardCost
                })
            ]);
        }
    }
}

