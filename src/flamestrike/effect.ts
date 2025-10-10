import { EffectModel, DamageModel, DamageEvent, DamageType, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('flamestrike-effect')
export class FlamestrikeEffectModel extends SpellEffectModel<[]> {
    constructor(props?: FlamestrikeEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Flamestrike's effect",
                desc: "Deal {{state.damage[0]}} damage to all enemy minions.",
                damage: [5],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] | undefined {
        // No target selection needed - affects all enemy minions
        return [];
    }

    protected async doRun() {
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;
        const card = this.route.card;
        if (!card) return;

        // Get all enemy minions
        const roles = opponent.query(true); // Only minions

        // Deal 5 damage to all enemy minions
        await DamageModel.run(roles.map((item) => new DamageEvent({
            type: DamageType.SPELL,
            source: card,
            method: this,
            target: item,
            origin: this.state.damage[0] ?? 0,
        })));
    }
}
