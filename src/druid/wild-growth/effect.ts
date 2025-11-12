import { EffectModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('wild-growth-effect')
export class WildGrowthEffectModel extends SpellEffectModel<[]> {
    constructor(props?: WildGrowthEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Wild Growth's effect",
                desc: "Gain an empty Mana Crystal.",
                damage: [],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected doRun() {
        const player = this.route.player;
        if (!player) return;
        
        // TODO: Gain an empty Mana Crystal
        // Need to implement mana crystal gain
        const mana = player.child.mana;
        // This should increase maximum mana by 1 (empty crystal)
        // mana.maximum += 1; // Need to check the correct API
    }
}

