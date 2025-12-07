import { Selector, SpellEffectModel, MinionCardModel, RestoreModel, RestoreEvent } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('siphon-soul-effect')
export class SiphonSoulEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: SiphonSoulEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Siphon Soul's effect",
                desc: "Destroy a minion. Restore 3 Health to your hero.",
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
        const player = this.route.player;
        if (!player) return;
        const card = this.route.card;
        if (!card) return;
        const hero = player.child.hero;
        
        // Destroy the minion
        target.child.dispose.destroy(card, this);
        
        // Restore 3 Health to your hero
        RestoreModel.deal([
            new RestoreEvent({
                source: card,
                method: this,
                target: hero,
                origin: 3,
            })
        ]);
    }
}

