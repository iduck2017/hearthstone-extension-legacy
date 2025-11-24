import { DamageEvent, DamageModel, DamageType, EffectModel, Selector, SpellEffectModel } from "hearthstone-core";
import { Model, TemplUtil } from "set-piece";
import { ArcaneMissilesSliceEffectModel } from "./slice";


export namespace ArcaneMissilesEffectModel {
    export type E = {}
    export type S = {}
    export type C = {
        slice: ArcaneMissilesSliceEffectModel
    }
    export type R = {}
}

@TemplUtil.is('arcane-missiles-effect')
export class ArcaneMissilesEffectModel extends SpellEffectModel<never,
    ArcaneMissilesEffectModel.E,
    ArcaneMissilesEffectModel.S,
    ArcaneMissilesEffectModel.C,
    ArcaneMissilesEffectModel.R
> {
    constructor(props?: ArcaneMissilesEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Arcane Missiles's effect",
                desc: "Deal *3* damage randomly split among all enemies.",
                ...props.state 
            },
            child: { 
                slice: props.child?.slice ?? new ArcaneMissilesSliceEffectModel(),
                ...props.child 
            },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<never> | undefined {
        return undefined
    }

    protected async doRun() {
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;
        const card = this.route.card;
        if (!card) return;

        const loop = 3 + this.state.offset;
        console.log('loops', loop)
        for (let index = 0; index < loop; index ++) {
            this.child.slice.run([])
        }
    }
} 