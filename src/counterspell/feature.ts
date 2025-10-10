import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType, CardModel, SpellPerformModel, SecretFeatureModel } from "hearthstone-core";
import { DebugUtil, Event, EventUtil, Model, TemplUtil } from "set-piece";

@TemplUtil.is('counterspell-effect')
export class CounterspellFeatureModel extends SecretFeatureModel {
    constructor(props?: CounterspellFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Counterspell's feature",
                desc: "When your opponent casts a spell, Counter it.",
                isActive: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.route.game?.proxy.all(SpellPerformModel).event.toRun)
    @SecretFeatureModel.span()
    private toCast(that: SpellPerformModel, event: Event) {
        const board = this.route.board;
        if (!board) return;
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (that.route.player !== opponent) return;
        event.abort();
        return true;
    }
}