import { RoleFeatureModel, DamageEvent, RoleHealthModel, MinionCardModel } from "hearthstone-core";
import { Event, EventPlugin, ChunkService } from "set-piece";

@ChunkService.is('armorsmith-feature')
export class ArmorsmithFeatureModel extends RoleFeatureModel {
    constructor(props?: ArmorsmithFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Armorsmith's feature",
                desc: "Whenever a friendly minion takes damage, gain 1 Armor.",
                isEnabled: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventPlugin.on(self => self.handleDamage)
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
        const player = this.route.player;
        if (!player) return;
        
        // Only trigger when a friendly minion takes damage (not hero, not enemy minion)
        const minion = that.route.minion;
        if (!minion) return;
        
        // Check if the minion is friendly
        if (minion.route.player !== player) return;
        
        // Gain 1 Armor for the hero
        const hero = player.child.hero;
        hero.child.armor.gain(1);
    }
}

