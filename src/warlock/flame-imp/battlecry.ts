import { BattlecryModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('flame-imp-battlecry')
export class FlameImpBattlecryModel extends BattlecryModel<never> {
    constructor(props?: FlameImpBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Flame Imp's Battlecry",
                desc: "Deal 3 damage to your hero.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): never | undefined {
        // No target selection needed
        return undefined;
    }

    public async doRun(params: Array<never | undefined>) {
        // Deal 3 damage to your hero
        const minion = this.route.minion;
        if (!minion) return;
        const player = this.route.player;
        if (!player) return;
        const hero = player.child.hero;
        
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: minion,
                target: hero,
                method: this,
                origin: 3,
            })
        ]);
    }
}
