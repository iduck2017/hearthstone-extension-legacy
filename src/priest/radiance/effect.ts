import { EffectModel, SpellEffectModel, RestoreModel, RestoreEvent, Selector } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('radiance-effect')
export class RadianceEffectModel extends SpellEffectModel<never> {
    constructor(props?: RadianceEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Radiance's effect",
                desc: "Restore 5 Health to your hero.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<never> | undefined {
        return undefined;
    }

    public async doRun() {
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
