import { BattlecryModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('azure-drake-battlecry')
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
    public precheck(): never | undefined {
        return undefined;
    }

    // Draw a card when this minion is summoned
    public async doRun(params: Array<never | undefined>) {
        const minion = this.route.minion;
        if (!minion) return;
        const player = this.route.player;
        if (!player) return;
        const hand = player.child.hand;
        hand.draw();
    }
} 