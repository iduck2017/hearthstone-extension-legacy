import { SpellEffectModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('repentance-effect')
export class RepentanceEffectModel extends SpellEffectModel<[]> {
    constructor(props?: RepentanceEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Repentance's effect",
                desc: "Secret: After your opponent plays a minion, reduce its Health to 1.",
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
        // After opponent plays a minion, reduce its Health to 1
    }
}

