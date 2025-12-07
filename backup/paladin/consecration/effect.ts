import { SpellEffectModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('consecration-effect')
export class ConsecrationEffectModel extends SpellEffectModel<[]> {
    constructor(props?: ConsecrationEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Consecration's effect",
                desc: "Deal {{spellDamage[0]}} damage to all enemies.",
                damage: [2],
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
        DamageModel.deal(enemies.map((item) => new DamageEvent({
            type: DamageType.SPELL,
            source: card,
            method: this,
            target: item,
            origin: this.state.damage[0] ?? 0,
        })));
    }
}

