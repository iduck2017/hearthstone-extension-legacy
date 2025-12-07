import { SpellEffectModel, RestoreModel, RestoreEvent } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('holy-light-effect')
export class HolyLightEffectModel extends SpellEffectModel<[]> {
    constructor(props?: HolyLightEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Holy Light's effect",
                desc: "Restore 8 Health to your hero.",
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
        const card = this.route.card;
        if (!card) return;
        const hero = player.child.hero;
        
        RestoreModel.deal([
            new RestoreEvent({
                source: card,
                method: this,
                target: hero,
                origin: 8,
            })
        ]);
    }
}

