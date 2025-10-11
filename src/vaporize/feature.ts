import { SecretFeatureModel, RoleModel, RoleAttackModel, AbortEvent } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('vaporize-feature')
export class VaporizeFeatureModel extends SecretFeatureModel {
    constructor(props?: VaporizeFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Vaporize's feature",
                desc: "When a minion attacks your hero, destroy it.",
                isActive: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleAttack)
    private listenAttack() {
        return this.route.player?.proxy.child.hero.child.role.child.attack.event?.toRecv
    }
    @SecretFeatureModel.span()
    private handleAttack(that: RoleAttackModel, event: AbortEvent<{ source: RoleModel }>) {
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
