import { Selector, SpellEffectModel, MinionCardModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('mortal-coil-effect')
export class MortalCoilEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: MortalCoilEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Mortal Coil's effect",
                desc: "Deal 1 damage to a minion. If that kills it, draw a card.",
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

        // Deal 1 damage to the target minion
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: 1,
            })
        ]);

        // Check if the minion was killed (disposed)
        if (target.child.dispose.state.isActived) {
            // If it was killed, draw a card
            const hand = player.child.hand;
            await hand.draw();
        }
    }
}

