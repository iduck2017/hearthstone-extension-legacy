import { CARD_ROUTE, CardRoute, DamageEvent, DamageModel, DamageType, EffectModel, SelectEvent } from "hearthstone-core";
import { Loader, Model, StoreUtil } from "set-piece";

export namespace ArcaneMissilesEffectProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = CardRoute
}

@StoreUtil.is('arcane-missiles-effect')
export class ArcaneMissilesEffectModel extends EffectModel<[],
    ArcaneMissilesEffectProps.E,
    ArcaneMissilesEffectProps.S,
    ArcaneMissilesEffectProps.C,
    ArcaneMissilesEffectProps.R,
    ArcaneMissilesEffectProps.P
> {
    constructor(loader?: Loader<ArcaneMissilesEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Arcane Missiles's effect",
                    desc: "Deal 3 damage randomly split among all enemies.",
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: CARD_ROUTE,
            }
        })
    }

    toRun(): [] { return [] }

    protected async doRun() {
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;
        const card = this.route.card;
        if (!card) return;
        for (let loop = 0; loop < 3; loop ++) {
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