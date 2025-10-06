import { EffectModel, SelectEvent, RoleModel, SpellEffectModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";
import { PowerWordShieldBuffModel } from "./buff";

@StoreUtil.is('power-word-shield-effect')
export class PowerWordShieldEffectModel extends SpellEffectModel<[RoleModel]> {
    constructor(loader?: Loader<PowerWordShieldEffectModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Power Word: Shield's effect",
                    desc: "Give a minion +2 Health. Draw a card.",
                    damage: [],
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }

    toRun(): [SelectEvent<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true); // Only minions can be targeted
        return [new SelectEvent(roles, { hint: "Choose a minion" })];
    }

    protected async doRun(target: RoleModel) {
        // Give the minion +2 Health buff
        const buff = new PowerWordShieldBuffModel();
        target.child.entries.add(buff);

        // Draw a card
        const player = this.route.player;
        if (!player) return;
        const deck = player.child.deck;
        deck.draw();
    }
}
