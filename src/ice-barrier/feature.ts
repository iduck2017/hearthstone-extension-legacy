import { AbortEvent, RoleAttackModel, RoleModel, SecretFeatureModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('ice-barrier-feature')
export class IceBarrierFeatureModel extends SecretFeatureModel {
    constructor(props?: IceBarrierFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Ice Barrier's feature",
                desc: "When your hero is attacked, gain 8 Armor.",
                isActive: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleRecv)
    private listenRecv() {
        return this.route.player?.proxy.child.hero.child.role.child.attack.event?.toRecv
    }
    @SecretFeatureModel.span()
    private handleRecv(that: RoleAttackModel, event: AbortEvent<{ source: RoleModel }>) {
        const player = this.route.player;
        if (!player) return;
        // Check if the attack target is the player's hero
        const hero = player.child.hero;
        hero.child.armor.restore(8);
        return true;
    }
}
