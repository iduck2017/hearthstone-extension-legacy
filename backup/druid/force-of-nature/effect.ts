import { EffectModel, SpellEffectModel } from "hearthstone-core";
import { ChunkService } from "set-piece";
// TODO: Implement Treant minion
// Need to create a 2/2 Treant minion and summon three of them

@ChunkService.is('force-of-nature-effect')
export class ForceOfNatureEffectModel extends SpellEffectModel<[]> {
    constructor(props?: ForceOfNatureEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Force of Nature's effect",
                desc: "Summon three 2/2 Treants.",
                damage: [],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected doRun() {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        
        // TODO: Summon three 2/2 Treants
        // Need to implement Treant minion first
        // for (let i = 0; i < 3; i++) {
        //     const treant = new TreantModel();
        //     treant.deploy(board);
        // }
    }
}

