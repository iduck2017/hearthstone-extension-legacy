import { FeatureModel, MinionCardModel, SpellDamageModel } from "hearthstone-core";
import { Event, EventPlugin, ChunkService } from "set-piece";
import { AegwynnTheGuardianDeathrattleModel } from "./deathrattle";

@ChunkService.is('aegwynn-the-guardian-context')
export class AegwynnTheGuardianContextModel extends FeatureModel {
    public get status() {
        return true;
    }

    constructor(props?: AegwynnTheGuardianContextModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Aegwynn The Guardian\'s feature',
                desc: 'The next minion you draw inherits Spell Damage +2.',
                actived: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventPlugin.on(self => self.handleDraw)
    private listenDraw() {
        return this.route.player?.proxy.child.hand.any(MinionCardModel).event?.onDraw
    }
    private handleDraw(that: MinionCardModel, event: Event) {
        const player = this.route.player;
        if (!player) return;
        if (!this.state.actived) return;
        that.buff(new SpellDamageModel({ state: { offset: 2 }}));
        that.buff(new AegwynnTheGuardianDeathrattleModel());
        player.debuff(this);
    }
}