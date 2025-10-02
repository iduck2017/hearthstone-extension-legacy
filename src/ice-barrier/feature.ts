import { CardFeatureModel, RoleAttackModel, RoleModel, SecretFeatureModel } from "hearthstone-core";
import { Event, EventUtil, Loader, StoreUtil } from "set-piece";

@StoreUtil.is('ice-barrier-feature')
export class IceBarrierFeatureModel extends SecretFeatureModel {
    constructor(loader?: Loader<IceBarrierFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: {
                    name: "Ice Barrier's feature",
                    desc: "Secret: When your hero is attacked, gain 8 Armor.",
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
    private onAttacked(that: RoleAttackModel, event: Event<{ target: RoleModel }>) {
        const player = this.route.player;
        if (!player) return;
        // Check if the attack target is the player's hero
        const hero = player.child.hero;
        hero.child.armor.get(8);
        return true;
    }
}
