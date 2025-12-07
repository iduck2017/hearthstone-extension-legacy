import { Selector, SpellEffectModel } from "hearthstone-core";
import { ChunkService } from "set-piece";
import { AvengingWrathSliceEffectModel } from "./slice";

export namespace AvengingWrathEffectModel {
    export type E = {}
    export type S = {}
    export type C = {
        slice: AvengingWrathSliceEffectModel
    }
    export type R = {}
}

@ChunkService.is('avenging-wrath-effect')
export class AvengingWrathEffectModel extends SpellEffectModel<never,
    AvengingWrathEffectModel.E,
    AvengingWrathEffectModel.S,
    AvengingWrathEffectModel.C,
    AvengingWrathEffectModel.R
> {
    constructor(props?: AvengingWrathEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Avenging Wrath's effect",
                desc: "Deal 8 damage randomly split among all enemies.",
                ...props.state
            },
            child: {
                slice: props.child?.slice ?? new AvengingWrathSliceEffectModel(),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<never> | undefined {
        return undefined;
    }

    protected async doRun() {
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;

        const loop = 8 + this.state.offset;
        for (let index = 0; index < loop; index++) {
            this.child.slice.run([])
        }
    }
}

