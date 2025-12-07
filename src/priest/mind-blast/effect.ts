import { EffectModel, SpellEffectModel, DamageModel, DamageEvent, DamageType, Selector } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('mind-blast-effect')
export class MindBlastEffectModel extends SpellEffectModel<never> {
    constructor(props?: MindBlastEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Mind Blast's effect",
                desc: "Deal *5* damage to the enemy hero.",
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
        
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const hero = opponent.child.hero;
        
        // Deal 5 damage (with spell damage bonus) to the enemy hero
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target: hero,
                origin: 5,
            })
        ]);
    }
}
