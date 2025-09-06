import { DeathrattleModel, RoleModel } from "hearthstone-core";
import { StoreUtil, Loader } from "set-piece";

@StoreUtil.is('bloodmage-thalnos-deathrattle')
export class BloodmageThalnosDeathrattleModel extends DeathrattleModel {
    constructor(loader?: Loader<BloodmageThalnosDeathrattleModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Bloodmage Thalnos\'s Deathrattle',
                    desc: 'Draw a card.',
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
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