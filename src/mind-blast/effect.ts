import { EffectModel, SpellEffectModel, DamageModel, DamageEvent } from "hearthstone-core";
import { Loader, TemplUtil } from "set-piece";

@TemplUtil.is('mind-blast-effect')
export class MindBlastEffectModel extends SpellEffectModel<[]> {
    constructor(loader?: Loader<MindBlastEffectModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Mind Blast's effect",
                    desc: "Deal 5 damage to the enemy hero.",
                    damage: [],
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }

    toRun(): [] {
        // No target selection needed - always targets the enemy hero
        return [];
    }

    protected async doRun() {
        const player = this.route.player;
        if (!player) return;

        const card = this.route.card;
        if (!card) return;
        
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const hero = opponent.child.hero;
        
        // Deal 5 damage to the enemy hero
        DamageModel.run([
            new DamageEvent({
                source: card,
                method: this,
                target: hero.child.role,
                origin: 5,
            })
        ]);
    }
}
