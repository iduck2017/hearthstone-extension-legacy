import { FeatureModel, MinionCardModel, SpellBuffModel } from "hearthstone-core";
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
            route: {},
        });
    }

    @EventUtil.on(self => self.route.player?.proxy.child.hand.child.minions.event.onDraw)
    private onDraw(that: MinionCardModel, event: Event) {
        const player = this.route.player;
        if (!player) return;
        if (!this.state.isActive) return;
        that.child.feats.add(new SpellBuffModel({ state: { offset: 2 }}))
        that.child.feats.add(new AegwynnTheGuardianDeathrattleModel());
        player.del(this);
    }
}