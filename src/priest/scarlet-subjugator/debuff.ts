import { RoleAttackBuffModel, FeatureModel, TurnModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

export namespace ScarletSubjugatorDebuffModel {
    export type E = {};
    export type S = { count: number};
    export type C = {};
    export type R = {};
}

@TemplUtil.is('scarlet-subjugator-debuff')
export class ScarletSubjugatorDebuffModel extends FeatureModel<
    ScarletSubjugatorDebuffModel.E,
    ScarletSubjugatorDebuffModel.S,
    ScarletSubjugatorDebuffModel.C,
    ScarletSubjugatorDebuffModel.R
> {
    constructor(props?: ScarletSubjugatorDebuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Scarlet Subjugator\'s Debuff',
                desc: '-2 Attack until your next turn.',
                isEnabled: true,
                count: 0,
                ...props.state,
            },
            child: {
                buffs: [new RoleAttackBuffModel({ state: { offset: -2 } })],
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleTurn)
    private listenTurn() {
        return this.route.game?.proxy.child.turn.event?.onStart
    }
    public async handleTurn(that: TurnModel, event: Event) {
        const count = this.state.count;
        const current = that.state.current;
        if (current !== count) return;
        this.disable();
    }
}
