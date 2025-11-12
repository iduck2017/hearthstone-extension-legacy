import { MinionBattlecryModel, RestoreModel, RestoreEvent } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('guardian-of-kings-battlecry')
export class GuardianOfKingsBattlecryModel extends MinionBattlecryModel<[]> {
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
            refer: { ...props.refer }
        });
    }

    public toRun(): [] { return [] }

    public doRun(from: number, to: number) {
        const player = this.route.player;
        if (!player) return;
        const card = this.route.card;
        if (!card) return;
        const hero = player.child.hero;
        
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

