import { MinionBattlecryModel, RoleModel, IRoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { TwilightDrakeBuffModel } from "./buff";

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

    public async doRun(from: number, to: number) {
        const card = this.route.minion;
        if (!card) return;

        const player = card.route.player;
        if (!player) return;

        const hand = player.child.hand;
        const size = hand.refer.queue?.length;
        console.log('size', size);
        if (!size) return;

        // Apply health buff based on hand size
        const buff = new TwilightDrakeBuffModel(() => ({
            state: { offset: [0, size] }
        }));
        const role = card.child.role;
        if (!role) return;
        role.child.feats.add(buff);
    }
}