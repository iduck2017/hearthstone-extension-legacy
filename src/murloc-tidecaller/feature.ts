import { FeatureModel, MinionCardModel } from "hearthstone-core";
import { EventUtil } from "set-piece";

export class MurlocTidecallerFeatureModel extends FeatureModel {
    constructor(props: MurlocTidecallerFeatureModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Tidecaller',
                desc: 'Whenever your summon a murloc, gain +1 Attack.',
                status: 1,
            },
            child: {},
            refer: {}
        });
    }

    @EventUtil.on(self => self.route.player?.proxy.child.board.child.cards.event.onSummon)
    private onSummon(that: MinionCardModel, event: {}) {
        if (!this.route.board) return;
    }
}