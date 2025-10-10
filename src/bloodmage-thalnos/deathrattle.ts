import { DeathrattleModel, ROLE_ROUTE, RoleModel, RoleRoute } from "hearthstone-core";
import { TemplUtil } from "set-piece";

export namespace BloodmageThalnosDeathrattleProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = RoleRoute
}

@TemplUtil.is('bloodmage-thalnos-deathrattle')
export class BloodmageThalnosDeathrattleModel extends DeathrattleModel<
    BloodmageThalnosDeathrattleProps.E,
    BloodmageThalnosDeathrattleProps.S,
    BloodmageThalnosDeathrattleProps.C,
    BloodmageThalnosDeathrattleProps.R,
    BloodmageThalnosDeathrattleProps.P
> {
    constructor(props?: BloodmageThalnosDeathrattleModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Bloodmage Thalnos\'s Deathrattle',
                desc: 'Draw a card.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
            route: ROLE_ROUTE,
        });
    }

    // Draw a card when this minion dies
    public async doRun() {
        const player = this.route.player;
        if (!player) return;
        const deck = player.child.deck;
        deck.draw();
    }
} 