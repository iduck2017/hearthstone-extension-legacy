import { SpellEffectModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('noble-sacrifice-effect')
export class NobleSacrificeEffectModel extends SpellEffectModel<[]> {
    constructor(props?: NobleSacrificeEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Noble Sacrifice's effect",
                desc: "Secret: When an enemy attacks, summon a 2/1 Defender as the new target.",
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
        // When enemy attacks, summon a 2/1 Defender as the new target
    }
}

