import { EffectModel, Selector, RoleModel, DamageModel, DamageEvent, DamageType, CardModel, SecretFeatureModel, AbortEvent, SpellCastEvent, SpellCardModel } from "hearthstone-core";
import { SpellPerformModel } from "hearthstone-core/dist/type/models/features/perform/spell";
import { DebugService, Event, EventPlugin, Model, ChunkService } from "set-piece";

@ChunkService.is('counterspell-effect')
export class CounterspellFeatureModel extends SecretFeatureModel {
    constructor(props?: CounterspellFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Counterspell's feature",
                desc: "When your opponent casts a spell, Counter it.",
                actived: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventPlugin.on(self => self.handleCast)
    private listenCast() {
        return this.route.game?.proxy.any(SpellCardModel).child.perform.event?.toRun
    }
    @SecretFeatureModel.span()
    private handleCast(that: SpellPerformModel, event: AbortEvent) {
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (that.route.player !== opponent) return;
        event.abort();
        return true;
    }
}