import { FeatureModel, MinionCardModel, SpellDamageModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";
import { AegwynnTheGuardianDeathrattleModel } from "./deathrattle";

@TemplUtil.is('aegwynn-the-guardian-context')
export class AegwynnTheGuardianContextModel extends FeatureModel {
    constructor(props?: AegwynnTheGuardianContextModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Aegwynn The Guardian\'s feature',
                desc: 'The next minion you draw inherits Spell Damage +2.',
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleDraw)
    private listenDraw() {
        return this.route.player?.proxy.child.hand.child.minions.event?.onDraw
    }
    private handleDraw(that: MinionCardModel, event: Event) {
        const player = this.route.player;
        if (!player) return;
        if (!this.state.isActive) return;
        that.child.feats.add(new SpellDamageModel({ state: { offset: 2 }}))
        that.child.feats.add(new AegwynnTheGuardianDeathrattleModel());
        player.del(this);
    }

    
}