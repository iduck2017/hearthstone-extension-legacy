import { EffectModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('claw-effect')
export class ClawEffectModel extends SpellEffectModel<[]> {
    constructor(props?: ClawEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Claw's effect",
                desc: "Give your hero +2 Attack this turn. Gain 2 Armor.",
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
        const hero = player.child.hero;
        
        // TODO: Give hero +2 Attack this turn only
        // Need to implement temporary attack buff
        
        // Gain 2 Armor
        hero.child.armor.restore(2);
    }
}

