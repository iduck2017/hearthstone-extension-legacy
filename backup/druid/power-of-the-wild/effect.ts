import { EffectModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
// TODO: Implement Choose One mechanic
// This card has two options:
// 1. Give your minions +1/+1
// 2. Summon a 3/2 Panther

@TemplUtil.is('power-of-the-wild-effect')
export class PowerOfTheWildEffectModel extends SpellEffectModel<[]> {
    constructor(props?: PowerOfTheWildEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Power of the Wild's effect",
                desc: "Choose One - Give your minions +1/+1; or Summon a 3/2 Panther.",
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
        // Option 1: Give all friendly minions +1/+1
        // Option 2: Summon a 3/2 Panther
    }
}

