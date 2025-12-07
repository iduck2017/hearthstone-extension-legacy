import { Selector, SpellEffectModel, MinionCardModel, DisposeModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('brawl-effect')
export class BrawlEffectModel extends SpellEffectModel<never> {
    constructor(props?: BrawlEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Brawl's effect",
                desc: "Destroy all minions except one. (chosen randomly)",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<never> | undefined {
        return undefined;
    }

    @DisposeModel.span()
    public async doRun() {
        const game = this.route.game;
        if (!game) return;
        
        // Get all minions on the board
        const minions = [...game.refer.minions];
        
        // If there are 0 or 1 minions, do nothing
        if (minions.length <= 1) return;
        
        // Randomly select one minion to survive
        const index = Math.floor(Math.random() * minions.length);
        const survivor = minions[index];
        
        // Destroy all minions except the survivor
        for (const minion of minions) {
            if (minion !== survivor) {
                const card = this.route.card;
                if (!card) continue;
                minion.child.dispose.destroy(card, this);
            }
        }
    }
}

