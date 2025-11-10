import { EffectModel, Selector, RoleModel, DamageModel, DamageEvent, DamageType, CardModel, SecretFeatureModel, AbortEvent, SpellCastEvent, SpellCardModel } from "hearthstone-core";
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

    @EventUtil.on(self => self.handleCast)
    private listenCast() {
        return this.route.game?.proxy.any(SpellCardModel).event?.toCast
    }
    @SecretFeatureModel.span()
    private handleCast(that: SpellCardModel, event: SpellCastEvent) {
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (that.route.player !== opponent) return;
        event.abort();
        return true;
    }
}