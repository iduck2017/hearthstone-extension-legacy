import { EffectModel, SpellEffectModel } from "hearthstone-core";
import { ChunkService } from "set-piece";
// TODO: Implement Choose One mechanic
// This card has two options:
// 1. Deal 5 damage to a minion (requires target selection)
// 2. Deal 2 damage to all enemy minions

@ChunkService.is('starfall-effect')
export class StarfallEffectModel extends SpellEffectModel<[]> {
    constructor(props?: StarfallEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Starfall's effect",
                desc: "Choose One - Deal 5 damage to a minion; or 2 damage to all enemy minions.",
                damage: [5],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected doRun() {
        // TODO: Implement Choose One mechanic
        // Need to implement the Choose One selection system
        // Option 1: Deal 5 damage to a minion (requires target selection)
        // Option 2: Deal 2 damage to all enemy minions
    }
}

