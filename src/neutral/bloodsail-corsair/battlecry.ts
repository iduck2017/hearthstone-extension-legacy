import { BattlecryModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('bloodsail-corsair-battlecry')
export class BloodsailCorsairBattlecryModel extends BattlecryModel<never> {
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
    public precheck(): never | undefined {
        return undefined;
    }

    // Remove 1 durability from opponent's weapon
    public async doRun(params: Array<never | undefined>) {
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const hero = opponent.child.hero;
        const weapon = hero.child.weapon;
        if (!weapon) return;
        // Remove 1 durability
        weapon.child.action.consume();
    }
} 