import { CardFeatureModel, FeatureModel, SpellCardModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";
import { FireballModel } from "../../mage/fireball";


@TemplUtil.is('archmage-antonidas-feature')
export class ArchmageAntonidasFeatureModel extends CardFeatureModel {
    constructor(props?: ArchmageAntonidasFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Archmage Antonidas's feature",
                desc: "Whenever you cast a spell, add a 'Fireball' spell to your hand.",
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleCast)
    private listenCast() {
        return this.route.player?.proxy.any(SpellCardModel).event?.onPlay
    }
    private handleCast(that: SpellCardModel, event: Event) {
        const player = this.route.player;
        if (!player) return;
        // Add a Fireball spell to the player's hand
        const fireball = new FireballModel();
        const hand = player.child.hand;
        hand.add(fireball);
    }
}
