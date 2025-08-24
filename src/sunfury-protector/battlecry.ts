import { BattlecryModel, BoardModel, CardModel, MinionModel, RoleEntriesModel, TauntModel } from "hearthstone-core";
import { StoreUtil } from "set-piece";

@StoreUtil.is('sunfury-protector-battlecry')
export class SunfuryProtectorBattlecryModel extends BattlecryModel<[]> {
    constructor(props: SunfuryProtectorBattlecryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Sunfury Protector\'s Battlecry',
                desc: 'Give adjacent minions Taunt.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // No target selection needed for this battlecry
    public toRun(): [] { return []; }

    // Give Taunt to adjacent minions when this minion is summoned
    public async doRun() {
        const board = this.route.board;
        if (!board) return;
        const card = this.route.card;
        if (!card) return;
        
        // Get the index of this minion on the board
        const index = board.child.cards.indexOf(card);
        if (index === -1) return;
        
        // Find adjacent minions (left and right)
        const left = board.child.cards[index - 1]?.child.minion;
        const right = board.child.cards[index + 1]?.child.minion;

        // Add Taunt to adjacent minions
        if (left) left.child.entries.child.taunt.active();
        if (right) right.child.entries.child.taunt.active();
    }
} 