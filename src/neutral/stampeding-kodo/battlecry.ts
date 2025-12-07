import { BattlecryModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('stampeding-kodo-battlecry')
export class StampedingKodoBattlecryModel extends BattlecryModel<never> {
    constructor(props?: StampedingKodoBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Stampeding Kodo's Battlecry",
                desc: "Destroy a random enemy minion with 2 or less Attack.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): never | undefined {
        // No target selection needed
        return undefined;
    }

    public async doRun(params: Array<never | undefined>) {
        const minion = this.route.minion;
        if (!minion) return;

        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;

        // Find enemy minions with 2 or less attack
        const cards = opponent.refer.minions
            .filter(item => item.child.attack.state.current <= 2);
        if (cards.length === 0) return;

        // Randomly select one target
        const index = Math.floor(Math.random() * cards.length);
        const target = cards[index];
        target?.child.dispose.destroy(minion, this);
    }
}
