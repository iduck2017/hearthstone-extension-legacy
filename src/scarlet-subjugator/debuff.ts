import { PlayerModel, IRoleBuffModel, TurnModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

export namespace ScarletSubjugatorDebuffProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {
        player?: PlayerModel;
    };
}

@TemplUtil.is('scarlet-subjugator-debuff')
export class ScarletSubjugatorDebuffModel extends IRoleBuffModel<
    ScarletSubjugatorDebuffProps.E,
    ScarletSubjugatorDebuffProps.S,
    ScarletSubjugatorDebuffProps.C,
    ScarletSubjugatorDebuffProps.R
> {
    constructor(props?: ScarletSubjugatorDebuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Scarlet Subjugator\'s Debuff',
                desc: '-2 Attack until your next turn.',
                offset: [-2, 0], // -2 Attack, 0 Health
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }


    @EventUtil.on(self => self.route.game?.proxy.child.turn.event.onStart)
    public async onStart(that: TurnModel, event: Event) {
        if (!this.route.board) return;
        const player = this.refer.player;
        console.log('onStart', player?.child.hero.name)
        if (!player) return;
        const current = that.refer.current;
        if (current !== player) return;
        console.log('deactive', player.child.hero.name, current.child.hero.name)
        this.deactive();
    }
}
