import { BattlecryModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('pit-lord-battlecry')
export class PitLordBattlecryModel extends BattlecryModel<never> {
    constructor(props?: PitLordBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Pit Lord's Battlecry",
                desc: "Deal 5 damage to your hero.",
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
        const minion = this.route.minion;
        if (!minion) return;
        const player = this.route.player;
        if (!player) return;
        const hero = player.child.hero;
        
        // Deal 5 damage to your hero
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.DEFEND,
                source: minion,
                target: hero,
                method: this,
                origin: 5,
            })
        ]);
    }
}

