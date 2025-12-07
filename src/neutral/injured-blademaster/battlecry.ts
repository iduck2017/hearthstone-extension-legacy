import { BattlecryModel, DamageModel, DamageType, DamageEvent } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('injured-blademaster-battlecry')
export class InjuredBlademasterBattlecryModel extends BattlecryModel<never> {
    constructor(props?: InjuredBlademasterBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Injured Blademaster's Battlecry",
                desc: "Deal 4 damage to HIMSELF.",
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
        const minion = this.route.minion;
        if (!minion) return;

        // Deal 4 damage to himself
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: minion,
                method: this,
                target: minion,
                origin: 4,
            })
        ]);
    }
}
