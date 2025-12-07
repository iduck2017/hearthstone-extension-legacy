import { CardFeatureModel, FeatureModel, SpellCardModel } from "hearthstone-core";
import { SpellPerformModel } from "hearthstone-core/dist/type/models/features/perform/spell";
import { Event, EventPlugin, ChunkService } from "set-piece";
import { FireballModel } from "../fireball";


@ChunkService.is('archmage-antonidas-feature')
export class ArchmageAntonidasFeatureModel extends CardFeatureModel {
    constructor(props?: ArchmageAntonidasFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Archmage Antonidas's feature",
                desc: "Whenever you cast a spell, add a 'Fireball' spell to your hand.",
                actived: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventPlugin.on(self => self.handleCast)
    private listenCast() {
        return this.route.player?.proxy.any(SpellCardModel).child.perform.event?.onPlay
    }
    private handleCast(that: SpellPerformModel, event: Event) {
        const player = this.route.player;
        if (!player) return;
        // Add a Fireball spell to the player's hand
        const fireball = new FireballModel();
        const hand = player.child.hand;
        hand.add(fireball);
    }
}
