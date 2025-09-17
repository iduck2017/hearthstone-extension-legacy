import { CardFeatureModel, SpellCardModel, SpellPerformModel } from "hearthstone-core";
import { Event, EventUtil, Loader, StoreUtil } from "set-piece";
import { ManaWyrmBuffModel } from "./buff";

@StoreUtil.is('mana-wyrm-feature')
export class ManaWyrmFeatureModel extends CardFeatureModel {
    constructor(loader?: Loader<ManaWyrmFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Mana Wyrm's feature",
                    desc: "Whenever you cast a spell, gain +1 Attack.",
                    isActive: true,
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer } 
            }
        })
    }

    @EventUtil.on(self => self.route.game?.proxy.all(SpellCardModel).event.onPlay)
    private onSpellCast(that: SpellCardModel, event: Event) {
        const minion = this.route.minion;
        if (!minion) return;
        const player = this.route.player;
        if (!player) return;
        
        // Only trigger when the minion's owner casts a spell
        if (that.route.player !== player) return;
        
        minion.child.role.add(new ManaWyrmBuffModel())
    }
}
