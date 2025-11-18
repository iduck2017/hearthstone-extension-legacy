import { BattlecryModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('azure-drake-battlecry')
export class AzureDrakeBattlecryModel extends BattlecryModel<never> {
    constructor(props?: AzureDrakeBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Azure Drake Battlecry',
                desc: 'Draw a card.',
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // No target selection needed for this battlecry
    public prepare(): never | undefined {
        return undefined;
    }

    // Draw a card when this minion is summoned
    public run(params: never[]) {
        const minion = this.route.minion;
        if (!minion) return;
        const player = this.route.player;
        if (!player) return;
        const deck = player.child.deck;
        deck.draw();
    }
} 