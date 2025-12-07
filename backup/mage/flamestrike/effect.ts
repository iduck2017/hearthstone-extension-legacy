import { EffectModel, DamageModel, DamageEvent, DamageType, SpellEffectModel, Selector } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('flamestrike-effect')
export class FlamestrikeEffectModel extends SpellEffectModel<never> {
    constructor(props?: FlamestrikeEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Flamestrike's effect",
                desc: "Deal {{spellDamage[0]}} damage to all enemy minions.",
                damage: [5],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public prepare(...prev: never[]): Selector<never> | undefined {
        return undefined
    }

    protected run(params: never[]) {
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;
        const card = this.route.card;
        if (!card) return;

        // Get all enemy minions
        const roles = opponent.refer.minions;

        // Deal 5 damage to all enemy minions
        DamageModel.deal(roles.map((item) => new DamageEvent({
            type: DamageType.SPELL,
            source: card,
            method: this,
            target: item,
            origin: this.state.damage[0] ?? 0,
        })));
    }
}
