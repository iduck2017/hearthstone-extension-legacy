import { RoleFeatureModel, RoleHealthModel, DamageEvent, TurnModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('commanding-shout-feature')
export class CommandingShoutContextModel extends RoleFeatureModel {
    constructor(props?: CommandingShoutContextModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Commanding Shout's protection",
                desc: "Can't be reduced below 1 Health this turn.",
                isEnabled: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleDamage)
    private listenDamage() {
        const health = this.route.role?.proxy.child.health;
        if (!health) return;
        return health.event?.toConsume;
    }
    private handleDamage(that: RoleHealthModel, event: DamageEvent) {
        
    }

    @EventUtil.on(self => self.handleTurn)
    private listenTurn() {
        const game = this.route.game;
        if (!game) return;
        const turn = game.proxy.child.turn;
        if (!turn) return;
        return turn.event?.onEnd;
    }
    private handleTurn(that: TurnModel, event: Event) {
        this.disable();
    }
}

