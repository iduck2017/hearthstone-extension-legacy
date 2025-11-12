import { SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('uthers-gift-effect')
export class UthersGiftEffectModel extends SpellEffectModel<[]> {
    constructor(props?: UthersGiftEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Uther's Gift's effect",
                desc: "Discover a Temporary Equality, Consecration, or Blessing of Kings.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected doRun() {
        // TODO: Implement Discover mechanic
        // Discover a Temporary Equality, Consecration, or Blessing of Kings
    }
}

