import { FeatureModel, RoleAttackBuffModel, TurnModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('abusive-sergeant-buff')
export class AbusiveSergeantBuffModel extends FeatureModel {
    constructor(props?: AbusiveSergeantBuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant\'s Buff',
                desc: '+2 Attack this turn.',
                isEnabled: true,
                ...props.state,
            },
            child: {
                buffs: [new RoleAttackBuffModel({ state: { offset: 2 } })],
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleTurn)
    private listenTurn() {
        return this.route.game?.proxy.child.turn.event?.onEnd
    }
    private handleTurn(that: TurnModel, event: Event) {
        this.disable();
    }
}
