import { SpellEffectModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('reckoning-effect')
export class ReckoningEffectModel extends SpellEffectModel<[]> {
    constructor(props?: ReckoningEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Reckoning's effect",
                desc: "Secret: After an enemy minion deals 3 or more damage, destroy it.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected doRun() {
        // TODO: Implement Secret mechanic
        // After an enemy minion deals 3 or more damage, destroy it
    }
}

