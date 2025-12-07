import { BattlecryModel, BaseFeatureModel, RoleHealthBuffModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('twilight-drake-battlecry')
export class TwilightDrakeBattlecryModel extends BattlecryModel<never> {
    constructor(props?: TwilightDrakeBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Twilight Drake's Battlecry",
                desc: "Gain +1 Health for each card in your hand.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): never | undefined {
        // No target selection needed
        return undefined;
    }

    public async doRun(params: Array<never | undefined>) {
        const card = this.route.minion;
        if (!card) return;

        const player = this.route.player;
        if (!player) return;

        const hand = player.child.hand;
        const count = hand.child.cards.length;
        if (!count) return;

        // Apply health buff based on hand size
        card.buff(new BaseFeatureModel({
            state: {
                name: "Twilight Drake's Health Buff",
                desc: "Gain +1 Health for each card in your hand.",
            },
            child: {
                buffs: [new RoleHealthBuffModel({ state: { offset: count } })]
            },
        }));
    }
}