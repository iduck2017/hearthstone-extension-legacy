import { EffectModel, DamageModel, DamageEvent, DamageType, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";


@TemplUtil.is('blizzard-effect')
export class BlizzardEffectModel extends SpellEffectModel<[]> {
    constructor(props?: BlizzardEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Blizzard's effect",
                desc: "Deal {{spellDamage[0]}} damage to all enemy minions and Freeze them.",
                damage: [2],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected async doRun() {
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;
        const card = this.route.card;
        if (!card) return;

        // Get all enemy minions
        const roles = opponent.query(true);
        
        // Deal 2 damage to all enemy minions
        await DamageModel.deal(roles.map((item) => new DamageEvent({
            type: DamageType.SPELL,
            source: card,
            method: this,
            target: item,
            origin: this.state.damage[0] ?? 0,
        })));
        // Freeze all enemy minions
        for (const role of roles) {
            const feats = role.child.feats;
            const frozen = feats.child.frozen;
            frozen.active();
        }
    }
}
