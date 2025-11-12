import { DiscoverModel, Selector, SelectorModel, SpellCardModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
// TODO: Import FeralRageModel, WildGrowthModel, SwipeModel when they are implemented
// import { FeralRageModel } from "../feral-rage";
import { WildGrowthModel } from "../wild-growth";
import { SwipeModel } from "../swipe";

export namespace MalfurionsGiftEffect {
    export type E = {}
    export type C = { discover: DiscoverModel<SpellCardModel> }
    export type S = {}
    export type R = {}
}

@TemplUtil.is('malfurions-gift-effect')
export class MalfurionsGiftEffectModel extends SpellEffectModel<[],
    MalfurionsGiftEffect.E,
    MalfurionsGiftEffect.S,
    MalfurionsGiftEffect.C,
    MalfurionsGiftEffect.R
> implements SelectorModel<SpellCardModel> {
    constructor(props?: MalfurionsGiftEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Malfurion's Gift's effect",
                desc: "Discover a Temporary Feral Rage, Wild Growth, or Swipe.",
                damage: [],
                ...props.state 
            },
            child: { 
                discover: new DiscoverModel({
                    child: {
                        // TODO: Add FeralRageModel when implemented
                        options: [new WildGrowthModel(), new SwipeModel()]
                    }
                }),
                ...props.child 
            },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected doRun() {
        const player = this.route.player;
        if (!player) return;
        player.child.controller.bind(this);

        // Placeholder for discover implementation
        // When discover mechanics are implemented, this should:
        // 1. Create temporary versions of Feral Rage, Wild Growth, and Swipe
        // 2. Present them to the player for selection
        // 3. Add the selected card to the player's hand
    }

    public get selector(): Selector<SpellCardModel> {
        const cards = [...this.child.discover.child.options];
        return new Selector<SpellCardModel>(cards, {
            then: (card) => this.onDiscover(card)
        });
    }

    public onDiscover(card?: SpellCardModel) {
        if (!card) return;
        const player = this.route.player;
        if (!player) return;
        player.child.hand.add(card);
    }
}

