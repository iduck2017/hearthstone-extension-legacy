import { FeatureModel, RoleAttackBuffModel, TurnModel } from "hearthstone-core";
import { Event, EventPlugin, ChunkService } from "set-piece";

@ChunkService.is('abusive-sergeant-buff')
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

    @EventPlugin.on(self => self.handleTurn)
    private listenTurn() {
        return this.route.game?.proxy.child.turn.event?.onEnd
    }
    private handleTurn(that: TurnModel, event: Event) {
        this.disable();
    }
}
