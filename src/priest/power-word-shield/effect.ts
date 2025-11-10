import { EffectModel, Selector, RoleModel, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { PowerWordShieldBuffModel } from "./buff";

@TemplUtil.is('power-word-shield-effect')
export class PowerWordShieldEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(props?: PowerWordShieldEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Power Word: Shield's effect",
                desc: "Give a minion +2 Health. Draw a card.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [Selector<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true); // Only minions can be targeted
        return [new Selector(roles, { hint: "Choose a minion" })];
    }

    protected async doRun(target: RoleModel) {
        // Give the minion +2 Health buff
        const buff = new PowerWordShieldBuffModel();
        target.child.feats.add(buff);

        // Draw a card
        const player = this.route.player;
        if (!player) return;
        const deck = player.child.deck;
        deck.draw();
    }
}
