import { BaseFeatureModel, RoleAttackBuffModel, RoleFeatureModel, RoleHealthBuffModel, SpellCardModel, SpellPerformModel } from "hearthstone-core";
import { Event, EventPlugin, ChunkService } from "set-piece";

@ChunkService.is('arcane-devourer-feature')
export class ArcaneDevourerFeatureModel extends RoleFeatureModel {

    constructor(props?: ArcaneDevourerFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Arcane Devourer's feature",
                desc: "Whenever you cast a spell, gain +2/+2.",
                isEnabled: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventPlugin.on(self => self.handleCast)
    protected listenCast() {
        const spell = this.route.game?.proxy.any(SpellCardModel);
        return spell?.child.perform.event?.onPlay
    }
    protected handleCast(that: SpellPerformModel, event: Event) {
        const minion = this.route.minion;
        if (!minion) return;
        const player = this.route.player;
        if (!player) return;
        
        // Only trigger when the minion's owner casts a spell
        if (that.route.player !== player) return;
        
        minion.buff(new BaseFeatureModel({
            state: {
                name: 'Arcane Devourer\'s Buff',
                desc: '+2/+2.',
            },
            child: {
                buffs: [
                    new RoleAttackBuffModel({ state: { offset: 2 } }),
                    new RoleHealthBuffModel({ state: { offset: 2 } })
                ]
            },
        }));
    }
}
