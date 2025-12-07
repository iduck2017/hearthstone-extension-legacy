import { RoleFeatureModel, RoleHealthModel, DamageEvent, TurnModel, MinionCardModel, RoleHealthDecor, OperatorType, FeatureModel } from "hearthstone-core";
import { Event, EventPlugin, StatePlugin, ChunkService } from "set-piece";

@ChunkService.is('commanding-shout-feature')
export class CommandingShoutContextModel extends FeatureModel {
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

    @StatePlugin.on(self => self.modifyHealth)
    protected listenHealth() {
        const player = this.route.player;
        const board = player?.proxy.child.board;
        const minions = board?.any(MinionCardModel);
        const health = minions?.child.health;
        console.warn('listenHealth', health?.decor);
        return health?.decor
    }
    private modifyHealth(that: RoleHealthModel, decor: RoleHealthDecor) {
        console.warn('modifyHealth', that, decor);
        decor.add({
            key: RoleHealthDecor.MINIMUM,
            type: OperatorType.SET,
            offset: 1,
            method: this,
        })
    }

    @EventPlugin.on(self => self.handleTurn)
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

