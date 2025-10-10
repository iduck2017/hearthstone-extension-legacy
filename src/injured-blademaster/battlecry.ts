import { MinionBattlecryModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('injured-blademaster-battlecry')
export class InjuredBlademasterBattlecryModel extends MinionBattlecryModel<[]> {
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

    public toRun(): [] | undefined {
        // No target selection needed
        return [];
    }

    public async doRun(from: number, to: number) {
        const minion = this.route.minion;
        if (!minion) return;

        const card = this.route.card;
        if (!card) return;

        const role = minion.child.role;
        // Deal 4 damage to himself
        DamageModel.run([new DamageEvent({
            type: DamageType.SPELL,
            source: card,
            method: this,
            target: role,
            origin: 4,
        })]);
    }
}
