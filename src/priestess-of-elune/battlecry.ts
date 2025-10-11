import { MinionBattlecryModel, RestoreModel, RestoreEvent } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('priestess-of-elune-battlecry')
export class PriestessOfEluneBattlecryModel extends MinionBattlecryModel<[]> {
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

    public toRun(): [] {
        // No target selection needed - always targets the player's hero
        return [];
    }

    public async doRun(from: number, to: number) {
        const player = this.route.player;
        if (!player) return;
        
        const hero = player.child.hero;
        const card = this.route.card;
        if (!card) return;
        
        // Restore 4 Health to your hero
        RestoreModel.deal([
            new RestoreEvent({
                source: card,
                method: this,
                target: hero.child.role,
                origin: 4,
            })
        ]);
    }
}
