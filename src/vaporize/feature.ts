import { SecretFeatureModel, RoleModel, RoleAttackModel } from "hearthstone-core";
import { Event, EventUtil, Loader, StoreUtil } from "set-piece";

@StoreUtil.is('vaporize-feature')
export class VaporizeFeatureModel extends SecretFeatureModel {
    constructor(loader?: Loader<VaporizeFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: {
                    name: "Vaporize's feature",
                    desc: "When a minion attacks your hero, destroy it.",
                    isActive: true,
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        })
    }

    @EventUtil.on(self => self.route.player?.proxy.child.hero.child.role.child.attack.event.toRecv)
    @SecretFeatureModel.span()
    private onAttacked(that: RoleAttackModel, event: Event<{ source: RoleModel }>) {
        const card = this.route.secret;
        if (!card) return;
        // Get the attack target from the event
        const role = event.detail.source;
        const minion = role.route.minion;
        if (!minion) return;
        minion.child.dispose.active(true, card, this);
        return true;
    }
}
