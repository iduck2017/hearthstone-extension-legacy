import { DamageEvent, DamageModel, DamageType, EffectModel, SelectEvent, SpellEffectModel } from "hearthstone-core";
import { Model, TemplUtil } from "set-piece";


@TemplUtil.is('arcane-missiles-effect')
export class ArcaneMissilesEffectModel extends SpellEffectModel<[]> {
    constructor(props?: ArcaneMissilesEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Arcane Missiles's effect",
                desc: "Deal {{state.damage[0]}} damage randomly split among all enemies.",
                damage: [3],
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

        const loop = this.state.damage[0] ?? 0;
        for (let index = 0; index < loop; index ++) {
            const roles = opponent.query();
            if (!roles.length) break;
            const index = Math.floor(Math.random() * roles.length);
            const target = roles[index];
            if (!target) break;
            await DamageModel.deal([
                new DamageEvent({
                    type: DamageType.SPELL,
                    source: card,
                    method: this,
                    target,
                    origin: 1,
                })
            ])
        }
    }
} 