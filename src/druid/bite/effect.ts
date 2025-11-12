import { EffectModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('bite-effect')
export class BiteEffectModel extends SpellEffectModel<[]> {
    constructor(props?: BiteEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Bite's effect",
                desc: "Give your hero +4 Attack this turn. Gain 4 Armor.",
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
        
        // TODO: Give hero +4 Attack this turn only
        // Need to implement temporary attack buff
        
        // Gain 4 Armor
        hero.child.armor.restore(4);
    }
}

