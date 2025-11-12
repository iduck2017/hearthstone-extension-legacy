import { Selector, MinionCardModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('blessing-of-wisdom-effect')
export class BlessingOfWisdomEffectModel extends SpellEffectModel<[MinionCardModel]> {
    constructor(props?: BlessingOfWisdomEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Blessing of Wisdom's effect",
                desc: "Choose a minion. Whenever it attacks, draw a card.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [Selector<MinionCardModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true);
        return [new Selector(roles, { hint: "Choose a minion" })]
    }

    protected doRun(target: MinionCardModel) {
        // TODO: Add effect that draws a card whenever the minion attacks
        // This requires implementing an attack hook or event listener
    }
}

