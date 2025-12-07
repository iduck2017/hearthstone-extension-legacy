import { BattlecryModel, RestoreModel, RestoreEvent } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('guardian-of-kings-battlecry')
export class GuardianOfKingsBattlecryModel extends BattlecryModel<never> {
    constructor(props?: GuardianOfKingsBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Guardian of Kings's Battlecry",
                desc: "Restore 6 Health to your hero.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck() {
        return undefined;
    }

    public async doRun() {
        const player = this.route.player;
        if (!player) return;
        const card = this.route.card;
        if (!card) return;
        const hero = player.child.hero;
        
        // Restore 6 Health to your hero
        RestoreModel.deal([
            new RestoreEvent({
                source: card,
                method: this,
                target: hero,
                origin: 6,
            })
        ]);
    }
}

