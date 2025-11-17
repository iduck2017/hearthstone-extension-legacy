import { EffectModel, Selector, RoleModel, SpellEffectModel, RoleBuffModel, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('power-word-shield-effect')
export class PowerWordShieldEffectModel extends SpellEffectModel<RoleModel> {
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

    public prepare(): Selector<RoleModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.refer.roles.filter(role => role instanceof MinionCardModel);
        return new Selector(roles, { hint: "Choose a minion" });
    }

    protected run(target: RoleModel) {
        // Give the minion +2 Health buff
        const buff = new RoleBuffModel({
            state: {
                name: "Power Word: Shield's Buff",
                desc: "+2 Health.",
                offset: [0, 2] // +0 Attack, +2 Health
            }
        });
        target.buff(buff);

        // Draw a card
        const player = this.route.player;
        if (!player) return;
        const deck = player.child.deck;
        deck.draw();
    }
}
