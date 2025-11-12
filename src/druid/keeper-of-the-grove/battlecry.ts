import { MinionBattlecryModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
// TODO: Implement Choose One mechanic
// This card has two options:
// 1. Deal 2 damage to a target
// 2. Silence a minion

@TemplUtil.is('keeper-of-the-grove-battlecry')
export class KeeperOfTheGroveBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(props?: KeeperOfTheGroveBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Keeper of the Grove Battlecry',
                desc: 'Choose One - Deal 2 damage; or Silence a minion.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toRun(): [] { return []; }

    public doRun(from: number, to: number) {
        // TODO: Implement Choose One mechanic
        // Need to implement the Choose One selection system
        // Option 1: Deal 2 damage to a target (requires target selection)
        // Option 2: Silence a minion (requires target selection)
    }
}

