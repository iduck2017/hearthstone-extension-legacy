import { EffectModel, SpellEffectModel, DamageModel, DamageEvent, RestoreModel, RestoreEvent, DamageType } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('holy-nova-effect')
export class HolyNovaEffectModel extends SpellEffectModel<[]> {
    constructor(props?: HolyNovaEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Holy Nova's effect",
                desc: "Deal {{spellDamage[0]}} damage to all enemy minions. Restore 2 Health to all friendly characters.",
                damage: [2],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected async doRun() {
        const game = this.route.game;
        const player = this.route.player;
        if (!game || !player) return;

        const opponent = player.refer.opponent;
        if (!opponent) return;

        const card = this.route.card;
        if (!card) return;

        // Deal 2 damage to all enemy minions
        const enemies = opponent.query(true);
        DamageModel.deal(enemies.map((item) => new DamageEvent({
            source: card,
            method: this,
            target: item,
            origin: this.state.damage[0] ?? 0,
            type: DamageType.DEFAULT,
        })));

        // Restore 2 Health to all friendly characters (hero and minions)
        const allies = player.query();
        RestoreModel.deal(allies.map((item) => new RestoreEvent({
            source: card,
            method: this,
            target: item,
            origin: 2,
        })));
    }
}
