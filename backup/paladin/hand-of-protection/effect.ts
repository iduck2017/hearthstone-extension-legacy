import { Selector, MinionCardModel, SpellEffectModel, DivineShieldModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('hand-of-protection-effect')
export class HandOfProtectionEffectModel extends SpellEffectModel<[MinionCardModel]> {
    constructor(props?: HandOfProtectionEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Hand of Protection's effect",
                desc: "Give a minion Divine Shield.",
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
        const divineShield = target.child.feats.child.divineShield;
        if (!divineShield) {
            target.child.feats.add(new DivineShieldModel({ state: { isActive: true } }));
        } else {
            divineShield.active();
        }
    }
}

