import { EffectModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
// TODO: Implement Choose One mechanic
// This card has two options:
// 1. Give a minion +4 Attack
// 2. Give a minion +4 Health and Taunt

@TemplUtil.is('mark-of-nature-effect')
export class MarkOfNatureEffectModel extends SpellEffectModel<[]> {
    constructor(props?: MarkOfNatureEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Mark of Nature's effect",
                desc: "Choose One - Give a minion +4 Attack; or +4 Health and Taunt.",
                damage: [],
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
        // Option 1: Give a minion +4 Attack (requires target selection)
        // Option 2: Give a minion +4 Health and Taunt (requires target selection)
    }
}

