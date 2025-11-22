import { RoleFeatureModel, RoleBuffModel, DamageEvent, RoleHealthModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('frothing-berserker-feature')
export class FrothingBerserkerFeatureModel extends RoleFeatureModel {
    constructor(props?: FrothingBerserkerFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Frothing Berserker's feature",
                desc: "Whenever a minion takes damage, gain +1 Attack.",
                isEnabled: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleDamage)
    private listenDamage() {
        const game = this.route.game;
        if (!game) return;
        const health = game.proxy.any(RoleHealthModel);
        if (!health) return;
        return health.event?.onConsume;
    }
    private handleDamage(that: RoleHealthModel, event: DamageEvent) {
        const role = this.route.role;
        if (!role) return;
        
        // Only trigger when a minion takes damage (not hero)
        const minion = that.route.minion;
        if (!minion) return;
        
        // Gain +1 Attack buff
        role.buff(new RoleBuffModel({
            state: {
                name: "Frothing Berserker's Buff",
                desc: "+1 Attack.",
                offset: [1, 0] // +1 Attack, +0 Health
            }
        }));
    }
}

