import { RoleFeatureModel, BoardModel, MinionCardModel } from "hearthstone-core";
import { Event, EventUtil, TemplUtil } from "set-piece";

@TemplUtil.is('warsong-commander-feature')
export class WarsongCommanderFeatureModel extends RoleFeatureModel {
    constructor(props?: WarsongCommanderFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Warsong Commander's feature",
                desc: "Whenever you summon a minion with 3 or less Attack, give it Charge.",
                isEnabled: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleSummon)
    private listenSummon() {
        const player = this.route.player;
        if (!player) return;
        const board = player.proxy.child.board;
        return board.event?.onSummon;
    }
    private handleSummon(that: BoardModel, event: Event<{ minion: MinionCardModel }>) {
        const { minion} = event.detail;
        if (!minion) return;
        
        const player = this.route.player;
        if (!player) return;
        
        // Only trigger for minions summoned by this player
        if (minion.route.player !== player) return;
        
        // Only trigger for minions with 3 or less Attack
        const attack = minion.child.attack;
        if (attack.state.origin > 3) return;
        
        // Give the minion Charge
        const charge = minion.child.charge;
        charge.enable();
    }
}

