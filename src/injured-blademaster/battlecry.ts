import { BattlecryModel, DamageType, DamageUtil, DamageEvent } from "hearthstone-core";
import { StoreUtil } from "set-piece";

@StoreUtil.is('injured-blademaster-battlecry')
export class InjuredBlademasterBattlecryModel extends BattlecryModel<[]> {
    constructor(props: InjuredBlademasterBattlecryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Injured Blademaster\'s Battlecry',
                desc: 'Deal 4 damage to HIMSELF.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    // No target selection needed for this battlecry
    public toRun(): [] { return []; }

    // Deal 4 damage to self when this minion is summoned
    public async doRun() {
        const card = this.route.card;
        if (!card) return;
        const minion = card.child.minion;
        if (!minion) return;
        
        // Deal 4 damage to self
        DamageUtil.run([
            new DamageEvent({
                source: this.child.anchor,
                target: minion,
                origin: 4,
                type: DamageType.DEFAULT,
            })
        ]);
    }
} 