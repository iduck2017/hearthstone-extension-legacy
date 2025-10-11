import { MinionCardModel, RoleModel, SecretFeatureModel, SpellCardModel, SpellHooksOptions, SpellCastEvent, SpellPerformModel } from "hearthstone-core";
import { Event, EventUtil } from "set-piece";
import { SpellbenderMinionModel } from "./minion";

export class SpellbenderFeatureModel extends SecretFeatureModel {
    constructor(props?: SpellbenderFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Spellbender's feature",
                desc: "When an enemy casts a spell on a minion, summon a 1/3 as the new target.",
                isActive: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    @EventUtil.on(self => self.handleCast)
    private listenCast() {
        return this.route.game?.proxy.any(SpellPerformModel).event?.toRun
    }
    @SecretFeatureModel.span()
    private handleCast(that: SpellPerformModel, event: SpellCastEvent) {
        const board = this.route.board;
        if (!board) return;

        const playerA = this.route.player;
        const playerB = that.route.player;
        if (playerA === playerB) return;

        const params = event.detail.options;
        let isValid = false;
        params.effects.forEach((value, key) => {
            value.forEach(item => {
                if (item instanceof RoleModel) isValid = true;
            })
        })
        if (!isValid) return;

        // deploy
        const card = new SpellbenderMinionModel();
        const role = card.child.role;
        const deploy = card.child.deploy;
        deploy.run(board);

        // replace the minion card with the spellbender minion
        event.redirect(role);
        return true;
    }
}