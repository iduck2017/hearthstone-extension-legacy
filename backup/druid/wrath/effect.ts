import { EffectModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
// TODO: Implement Choose One mechanic
// This card has two options:
// 1. Deal 3 damage to a minion
// 2. Deal 1 damage to a minion and draw a card

@TemplUtil.is('wrath-effect')
export class WrathEffectModel extends SpellEffectModel<[]> {
    constructor(props?: WrathEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Wrath's effect",
                desc: "Choose One - Deal 3 damage to a minion; or 1 damage and draw a card.",
                damage: [3],
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
        // Option 1: Deal 3 damage to a minion (requires target selection)
        // Option 2: Deal 1 damage to a minion and draw a card (requires target selection)
    }
}

