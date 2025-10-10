import { DamageEvent, DamageModel, DamageType, EffectModel, SelectEvent, SpellEffectModel } from "hearthstone-core";
import { Model, TemplUtil } from "set-piece";

export namespace ArcaneMissilesEffectProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@TemplUtil.is('arcane-missiles-effect')
export class ArcaneMissilesEffectModel extends SpellEffectModel<[],
    ArcaneMissilesEffectProps.E,
    ArcaneMissilesEffectProps.S,
    ArcaneMissilesEffectProps.C,
    ArcaneMissilesEffectProps.R
> {
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
            await DamageModel.run([
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