import { EffectModel, SpellEffectModel, RestoreModel, RestoreEvent } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('radiance-effect')
export class RadianceEffectModel extends SpellEffectModel<[]> {
    constructor(props?: RadianceEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Radiance's effect",
                desc: "Restore 5 Health to your hero.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] {
        // No target selection needed - always targets the hero
        return [];
    }

    protected doRun() {
        const player = this.route.player;
        if (!player) return;
        const card = this.route.card;
        if (!card) return;
        const hero = player.child.hero;
        
        // Restore 5 Health to the hero
        RestoreModel.deal([
            new RestoreEvent({
                source: card,
                method: this,
                target: hero,
                origin: 5,
            })
        ]);
    }
}
