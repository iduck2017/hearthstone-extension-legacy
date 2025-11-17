import { MinionBattlecryModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
// TODO: Implement Choose One mechanic
// This card has two options:
// 1. Draw 2 cards
// 2. Restore 7 Health to a target

@TemplUtil.is('ancient-of-lore-battlecry')
export class AncientOfLoreBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(props?: AncientOfLoreBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Ancient of Lore Battlecry',
                desc: 'Choose One - Draw 2 cards; or Restore 7 Health.',
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
        // Option 1: Draw 2 cards
        // Option 2: Restore 7 Health to a target (requires target selection)
    }
}

