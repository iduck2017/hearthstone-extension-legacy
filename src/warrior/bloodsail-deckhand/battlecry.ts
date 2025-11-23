import { BattlecryModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { BloodsailDeckhandFeatureModel } from "./feature";

@TemplUtil.is('bloodsail-deckhand-battlecry')
export class BloodsailDeckhandBattlecryModel extends BattlecryModel<never> {
    constructor(props?: BloodsailDeckhandBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Bloodsail Deckhand's Battlecry",
                desc: "The next weapon you play costs (1) less.",
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): never | undefined {
        return undefined;
    }

    public async doRun(params: Array<never | undefined>) {
        const player = this.route.player;
        if (!player) return;
        player.buff(new BloodsailDeckhandFeatureModel());
    }
}

