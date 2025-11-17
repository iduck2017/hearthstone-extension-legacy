import { EffectModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
// TODO: Implement Choose One mechanic
// This card has two options:
// 1. Gain 2 Mana Crystals
// 2. Draw 3 cards

@TemplUtil.is('nourish-effect')
export class NourishEffectModel extends SpellEffectModel<[]> {
    constructor(props?: NourishEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Nourish's effect",
                desc: "Choose One - Gain 2 Mana Crystals; or Draw 3 cards.",
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
        // Option 1: Gain 2 Mana Crystals
        // Option 2: Draw 3 cards
    }
}

