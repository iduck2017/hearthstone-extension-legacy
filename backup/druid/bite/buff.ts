import { GameModel, IRoleBuffModel, RoleModel, TurnModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('bite-buff')
export class BiteBuffModel extends IRoleBuffModel {
    constructor(props?: BiteBuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Bite's Buff",
                desc: '+4 Attack this turn.',
                offset: [4, 0],
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

