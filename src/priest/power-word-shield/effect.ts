import { EffectModel, Selector, SpellEffectModel, BaseFeatureModel, RoleHealthBuffModel, MinionCardModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('power-word-shield-effect')
export class PowerWordShieldEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: PowerWordShieldEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Power Word: Shield's effect",
                desc: "Give a minion +2 Health. Draw a card.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<MinionCardModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.minions;
        return new Selector(roles, { hint: "Choose a minion" });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;
        // Give the minion +2 Health buff
        target.buff(new BaseFeatureModel({
            state: {
                name: "Power Word: Shield's Buff",
                desc: "+2 Health.",
            },
            child: {
                buffs: [new RoleHealthBuffModel({ state: { offset: 2 } })]
            },
        }));

        // Draw a card
        const player = this.route.player;
        if (!player) return;
        const hand = player.child.hand;
        hand.draw();
    }
}

