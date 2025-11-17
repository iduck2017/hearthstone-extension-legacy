import { SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('innervate-effect')
export class InnervateEffectModel extends SpellEffectModel<[]> {
    constructor(props?: InnervateEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Innervate's effect",
                desc: "Gain 1 Mana Crystal this turn only.",
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
        // Need to implement temporary mana crystal gain
        player.child.mana.restore(2);
        // This should be temporary (only for this turn)
        // mana.restore(1); // This would be permanent, need temporary version
    }
}

