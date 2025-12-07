import { Selector, RoleModel, MinionCardModel, SpellEffectModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('naturalize-effect')
export class NaturalizeEffectModel extends SpellEffectModel<[MinionCardModel]> {
    constructor(props?: NaturalizeEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Naturalize's effect",
                desc: "Destroy a minion. Your opponent draws 2 cards.",
                damage: [],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [Selector<MinionCardModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true);
        return [new Selector(roles, { hint: "Choose a minion" })]
    }

    protected doRun(target: MinionCardModel) {
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const card = this.route.card;
        if (!card) return;
        
        // Destroy the minion
        target.child.dispose.active(true, card, this);
        
        // Opponent draws 2 cards
        const deck = opponent.child.deck;
        deck.draw();
        deck.draw();
    }
}

