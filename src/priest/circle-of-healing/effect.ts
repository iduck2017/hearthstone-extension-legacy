import { EffectModel, RestoreEvent, RestoreModel, SpellEffectModel, Selector, MinionCardModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('circle-of-healing-effect')
export class CircleOfHealingEffectModel extends SpellEffectModel<never> {
    constructor(props?: CircleOfHealingEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Circle of Healing's effect",
                desc: "Restore 4 Health to ALL minions.",
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
        const game = this.route.game;
        if (!game) return;
        const card = this.route.card;
        if (!card) return;

        const minions = game.refer.minions;
        // Restore 4 Health to all minions
        RestoreModel.deal(minions.map((item) => new RestoreEvent({
            source: card,
            method: this,
            target: item,
            origin: 4,
        })));
    }
}
