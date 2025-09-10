import { BattlecryModel } from "hearthstone-core";
import { StoreUtil, Loader } from "set-piece";

@StoreUtil.is('bloodsail-corsair-battlecry')
export class BloodsailCorsairBattlecryModel extends BattlecryModel<[]> {
    constructor(loader?: Loader<BloodsailCorsairBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Bloodsail Corsair Battlecry',
                    desc: 'Remove 1 Durability from your opponent\'s weapon.',
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer }
            }
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
        const weapon = opponent.child.hero.child.weapon;
        if (!weapon) return;
        // Remove 1 durability
        weapon.child.durability.consume()
    }
} 