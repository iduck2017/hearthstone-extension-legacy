import { GameModel, IRoleBuffModel, RoleModel, TurnModel } from "hearthstone-core";
import { DebugUtil, Event, EventUtil, TemplUtil, TranxUtil } from "set-piece";

@TemplUtil.is('abusive-sergeant-buff')
export class AbusiveSergeantBuffModel extends IRoleBuffModel {
    constructor(props?: AbusiveSergeantBuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant\'s Buff',
                desc: '+2 Attack this turn.',
                offset: [2, 0],
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.route.game?.proxy.child.turn.event.onEnd)
    private onTurnEnd(that: TurnModel, event: Event) {
        this.deactive();
    }   
}
