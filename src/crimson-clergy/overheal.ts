import { FeatureModel, OverhealModel, RoleHealthModel, RoleModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('crimson-clergy-overheal')
export class CrimsonClergyOverhealModel extends OverhealModel {
    constructor(props?: CrimsonClergyOverhealModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Crimson Clergy\'s feature',
                desc: 'Overheal: Draw a card.',
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    protected doRun() {
        const player = this.route.player;
        if (!player) return;
        // Draw a card for overheal
        const deck = player.child.deck;
        deck.draw();
    }
}
