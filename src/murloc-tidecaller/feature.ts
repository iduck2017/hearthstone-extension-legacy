import { FeatureModel, MinionModel, RaceType } from "hearthstone-core";
import { EventUtil } from "set-piece";
import { MurlocTidecallerBuffModel } from "./buff";

export class MurlocTidecallerFeatureModel extends FeatureModel {
    constructor(props: MurlocTidecallerFeatureModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Tidecaller\'s Feature',
                desc: 'Whenever your summon a murloc, gain +1 Attack.',
                status: 1,
            },
            child: {},
            refer: {}
        });
    }

    @EventUtil.on(self => self.route.player?.proxy.child.board.child.cards.event.onSummon)
    private onSummon(that: MinionModel, event: {}) {
        const role = this.route.role;
        const card = this.route.card;
        if (!role) return;
        if (!this.route.board) return;
        if (!that.state.races.includes(RaceType.MURLOC)) return;
        if (that === card) return;
        console.log("summon", that.name);
        role.child.features.add(new MurlocTidecallerBuffModel({}));
    }
}