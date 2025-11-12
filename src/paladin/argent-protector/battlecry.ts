import { MinionBattlecryModel, Selector, MinionCardModel, DivineShieldModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('argent-protector-battlecry')
export class ArgentProtectorBattlecryModel extends MinionBattlecryModel<[MinionCardModel]> {
    constructor(props?: ArgentProtectorBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Argent Protector's Battlecry",
                desc: "Give a friendly minion Divine Shield.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        });
    }

    public toRun(): [Selector<MinionCardModel>] | undefined {
        const player = this.route.player;
        if (!player) return;
        const minions = player.query(true);
        if (minions.length === 0) return;
        return [new Selector(minions, { hint: "Choose a friendly minion" })];
    }

    public doRun(from: number, to: number, target: MinionCardModel) {
        target.child.feats.child.divineShield.active();
    }
}
