import { EffectModel, SpellEffectModel, DamageModel, DamageEvent } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('mind-blast-effect')
export class MindBlastEffectModel extends SpellEffectModel<[]> {
    constructor(props?: MindBlastEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Mind Blast's effect",
                desc: "Deal 5 damage to the enemy hero.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] {
        // No target selection needed - always targets the enemy hero
        return [];
    }

    protected doRun() {
        const player = this.route.player;
        if (!player) return;

        const card = this.route.card;
        if (!card) return;
        
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const hero = opponent.child.hero;
        
        // Deal 5 damage to the enemy hero
        DamageModel.deal([
            new DamageEvent({
                source: card,
                method: this,
                target: hero,
                origin: 5,
            })
        ]);
    }
}
