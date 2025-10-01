import { CardFeatureModel, CostDecor, CostModel, CostType, FeatureModel, ManaModel, SecretCardModel, SecretDeployModel, SpellCardModel } from "hearthstone-core";
import { Event, EventUtil, Loader, Model, StateUtil, StoreUtil } from "set-piece";

@StoreUtil.is('kirin-tor-mage-feature')
export class KirinTorMageFeatureModel extends FeatureModel {
    constructor(loader?: Loader<KirinTorMageFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: {
                    name: "Kirin Tor Mage's feature",
                    desc: "The next Secret you play this turn costs (0).",
                    isActive: true,
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        })
    }

    @StateUtil.on(self => self.route.player?.proxy.child.hand.child.spells.child.cost.decor)
    private onCompute(that: CostModel, decor: CostDecor) {
        if (!this.state.isActive) return;
        const player = this.route.player;
        if (!player) return;
        
        const card = that.route.card;
        if (!(card instanceof SecretCardModel)) return;
        decor.free();
    }

    @EventUtil.on(self => self.route.player?.proxy.child.mana.event.onUse)
    private onPlay(that: ManaModel, event: Event<{ reason?: Model }>) {
        const reason = event.detail.reason;
        if (!(reason instanceof SecretCardModel)) return;
        this.deactive();
    }

}
