import { MinionCardModel, SecretFeatureModel, SpellCardModel, SpellCastEvent } from "hearthstone-core";
import { Event, EventPlugin } from "set-piece";
import { SpellbenderMinionModel } from "./minion";
import { SpellPerformModel } from "hearthstone-core/dist/type/models/features/perform/spell";

export class SpellbenderFeatureModel extends SecretFeatureModel {
    constructor(props?: SpellbenderFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Spellbender's feature",
                desc: "When an enemy casts a spell on a minion, summon a 1/3 as the new target.",
                actived: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    @EventPlugin.on(self => self.handleCast)
    private listenCast() {
        return this.route.game?.proxy.any(SpellCardModel).child.perform.event?.toCast
    }
    @SecretFeatureModel.span()
    private handleCast(that: SpellPerformModel, event: SpellCastEvent) {
        const board = this.route.board;
        if (!board) return;

        const playerA = this.route.player;
        const playerB = that.route.player;
        if (playerA === playerB) return;

        const params = event.detail.config;
        let isValid = false;
        params.effects.forEach((value, key) => {
            value.forEach(item => {
                if (item instanceof MinionCardModel) isValid = true;
            })
        })
        if (!isValid) return;

        // deploy
        const card = new SpellbenderMinionModel();
        card.summon(board);
        // replace the minion card with the spellbender minion
        event.redirect(card);
        return true;
    }
}