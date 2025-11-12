import { SpellEffectModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('avenging-wrath-effect')
export class AvengingWrathEffectModel extends SpellEffectModel<[]> {
    constructor(props?: AvengingWrathEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Avenging Wrath's effect",
                desc: "Deal {{spellDamage[0]}} damage randomly split among all enemies.",
                damage: [8],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected doRun() {
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;
        const card = this.route.card;
        if (!card) return;

        const enemies = opponent.query();
        if (!enemies.length) return;

        // Deal damage randomly split among all enemies
        // this.state.damage[0] includes spell damage bonus
        const count = this.state.damage[0] ?? 0;
        for (let i = 0; i < count; i++) {
            const roles = opponent.query();
            if (!roles.length) break;
            const index = Math.floor(Math.random() * roles.length);
            const target = roles[index];
            if (!target) break;
            DamageModel.deal([
                new DamageEvent({
                    type: DamageType.SPELL,
                    source: card,
                    method: this,
                    target,
                    origin: 1,
                })
            ]);
        }
    }
}

