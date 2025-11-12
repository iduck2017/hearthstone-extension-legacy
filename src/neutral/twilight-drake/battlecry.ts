import { MinionBattlecryModel, RoleModel, RoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('twilight-drake-battlecry')
export class TwilightDrakeBattlecryModel extends MinionBattlecryModel<[]> {
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

    public toRun(): [] | undefined {
        // No target selection needed
        return [];
    }

    public doRun(from: number, to: number) {
        const card = this.route.minion;
        if (!card) return;

        const player = card.route.player;
        if (!player) return;

        const hand = player.child.hand;
        const count = hand.child.cards.length;
        if (!count) return;

        // Apply health buff based on hand size
        const buff = new RoleBuffModel({
            state: {
                name: "Twilight Drake's Health Buff",
                desc: "Gain +1 Health for each card in your hand.",
                offset: [0, count]
            }
        });
        card.child.feats.add(buff);
    }
}