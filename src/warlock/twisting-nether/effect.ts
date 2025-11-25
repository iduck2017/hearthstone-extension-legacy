import { Selector, SpellEffectModel, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('twisting-nether-effect')
export class TwistingNetherEffectModel extends SpellEffectModel<never> {
    constructor(props?: TwistingNetherEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Twisting Nether's effect",
                desc: "Destroy all minions and locations.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<never> | undefined {
        return undefined;
    }

    public async doRun() {
        const game = this.route.game;
        if (!game) return;
        const card = this.route.card;
        if (!card) return;

        // Get all minions on the board
        const minions = [...game.refer.minions];

        // Destroy all minions
        for (const minion of minions) {
            minion.child.dispose.destroy(card, this);
        }

        // TODO: Destroy all locations
        // Need to implement location destruction
    }
}

