import { SecretFeatureModel, RoleAttackModel, AbortEvent, HeroModel, RoleHealthModel } from "hearthstone-core";
import { RoleModel } from "hearthstone-core/dist/type/models/entities/heroes";
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
                actived: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleAttack)
    private listenAttack() {
        return this.route.player?.proxy.child.hero.child.attack.event?.toReceive
    }
    @SecretFeatureModel.span()
    private handleAttack(that: RoleAttackModel, event: AbortEvent<{ source: RoleModel }>) {
        const card = this.route.secret;
        if (!card) return;
        // Get the attack target from the event
        const role = event.detail.source;
        role.child.dispose.destroy(card, this);
        return true;
    }
}
