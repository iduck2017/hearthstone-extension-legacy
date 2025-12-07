import { EffectModel, SpellEffectModel } from "hearthstone-core";
import { ChunkService } from "set-piece";
import { BiteBuffModel } from "./buff";

@ChunkService.is('bite-effect')
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
        
        // Give hero +4 Attack this turn only
        const buff = new BiteBuffModel();
        hero.child.feats.add(buff);
        
        // Gain 4 Armor
        hero.child.armor.restore(4);
    }
}

