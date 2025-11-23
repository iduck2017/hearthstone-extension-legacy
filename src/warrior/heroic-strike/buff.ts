import { RoleAttackBuffModel, FeatureModel, TurnModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('heroic-strike-buff')
export class HeroicStrikeBuffModel extends FeatureModel {
    constructor(props?: HeroicStrikeBuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Heroic Strike's Buff",
                desc: "+4 Attack this turn.",
                isEnabled: true,
                ...props.state,
            },
            child: {
                buffs: [new RoleAttackBuffModel({ state: { offset: 4 } })],
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleTurn)
    private listenTurn() {
        const game = this.route.game;
        if (!game) return;
        const turn = game.proxy.child.turn;
        if (!turn) return;
        return turn.event?.onEnd
    }
    private handleTurn(that: TurnModel, event: Event) {
        this.disable();
    }
}

