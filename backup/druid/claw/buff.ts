import { GameModel, IRoleBuffModel, RoleModel, TurnModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('claw-buff')
export class ClawBuffModel extends IRoleBuffModel {
    constructor(props?: ClawBuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Claw's Buff",
                desc: '+2 Attack this turn.',
                offset: [2, 0],
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleTurn)
    private listenTurn() {
        return this.route.game?.proxy.child.turn.event?.onEnd
    }
    private handleTurn(that: TurnModel, event: Event) {
        this.deactive();
    }
}

