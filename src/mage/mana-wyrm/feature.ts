import { SpellCardModel, RoleFeatureModel, SpellPerformModel, BuffModel, RoleAttackBuffModel, FeatureModel, BaseFeatureModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('mana-wyrm-feature')
export class ManaWyrmFeatureModel extends RoleFeatureModel {

    constructor(props?: ManaWyrmFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Mana Wyrm's feature",
                desc: "Whenever you cast a spell, gain +1 Attack.",
                isEnabled: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleCast)
    private listenCast() {
        const spell = this.route.player?.proxy.any(SpellCardModel);
        return spell?.child.perform.event?.onPlay
    }
    protected handleCast(that: SpellPerformModel, event: Event) {
        const role = this.route.role;
        if (!role) return;
        const player = this.route.player;
        if (!player) return;
        
        // Only trigger when the minion's owner casts a spell
        if (that.route.player !== player) return;
        
        role.buff(new BaseFeatureModel({
            state: {
                name: 'Mana Wyrm\'s Buff',
                desc: '+1 Attack.',
            },
            child: {
                buffs: [new RoleAttackBuffModel({ state: { offset: 1 } })]
            },
        }));
    }
}
