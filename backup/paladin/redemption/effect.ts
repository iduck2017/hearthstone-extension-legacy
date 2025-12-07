import { SpellEffectModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('redemption-effect')
export class RedemptionEffectModel extends SpellEffectModel<[]> {
    constructor(props?: RedemptionEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Redemption's effect",
                desc: "Secret: When a friendly minion dies, return it to life with 1 Health.",
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
        // When a friendly minion dies, return it to life with 1 Health
    }
}

