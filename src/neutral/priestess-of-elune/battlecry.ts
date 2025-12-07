import { BattlecryModel, RestoreModel, RestoreEvent } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('priestess-of-elune-battlecry')
export class PriestessOfEluneBattlecryModel extends BattlecryModel<never> {
    constructor(props?: PriestessOfEluneBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Priestess of Elune's Battlecry",
                desc: "Restore 4 Health to your hero.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): never | undefined {
        // No target selection needed - always targets the player's hero
        return undefined;
    }

    public async doRun(params: Array<never | undefined>) {
        const minion = this.route.minion;
        if (!minion) return;
        const player = this.route.player;
        if (!player) return;
        
        const hero = player.child.hero;
        
        // Restore 4 Health to your hero
        RestoreModel.deal([
            new RestoreEvent({
                source: minion,
                method: this,
                target: hero,
                origin: 4,
            })
        ]);
    }
}
