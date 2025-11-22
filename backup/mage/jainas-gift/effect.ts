import { DiscoverModel, Selector, SelectorModel, SpellCardModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { FrostboltModel } from "../frostbolt";
import { ArcaneIntellectModel } from "../arcane-intellect";
import { FireballModel } from "../fireball";

export namespace JainasGiftEffect {
    export type E = {}
    export type C = { discover: DiscoverModel<SpellCardModel> }
    export type S = {}
    export type R = {}
}

@TemplUtil.is('jainas-gift-effect')
export class JainasGiftEffectModel extends SpellEffectModel<never,
    JainasGiftEffect.E,
    JainasGiftEffect.S,
    JainasGiftEffect.C,
    JainasGiftEffect.R
> implements SelectorModel<SpellCardModel> {
    constructor(props?: JainasGiftEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Jaina's Gift's effect",
                desc: "Discover a Temporary Frostbolt, Arcane Intellect, or Fireball.",
                damage: [],
                ...props.state 
            },
            child: { 
                discover: new DiscoverModel({
                    child: {
                        options: [new FrostboltModel(), new ArcaneIntellectModel(), new FireballModel()]
                    }
                }),
                ...props.child 
            },
            refer: { ...props.refer },
        });
    }

    public prepare(...prev: never[]): Selector<never> | undefined {
        return undefined
    }

    protected run(params: never[]) {
        const player = this.route.player;
        if (!player) return;
        player.controller.bind(this);

        // Placeholder for discover implementation
        // When discover mechanics are implemented, this should:
        // 1. Create temporary versions of Frostbolt, Arcane Intellect, and Fireball
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

