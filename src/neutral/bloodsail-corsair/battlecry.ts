import { MinionBattlecryModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('bloodsail-corsair-battlecry')
export class BloodsailCorsairBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(props?: BloodsailCorsairBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Bloodsail Corsair Battlecry',
                desc: 'Remove 1 Durability from your opponent\'s weapon.',
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        });
    }

    // No target selection needed for this battlecry
    public toRun(): [] { return []; }

    // Remove 1 durability from opponent's weapon
    public async doRun() {
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const weapon = opponent.child.board.child.weapon;
        if (!weapon) return;
        // Remove 1 durability
        weapon.child.action.consume();
    }
} 