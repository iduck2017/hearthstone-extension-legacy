import { Selector, SpellEffectModel, DamageModel, DamageEvent, DamageType, RoleModel, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('cleave-effect')
export class CleaveEffectModel extends SpellEffectModel<never> {
    constructor(props?: CleaveEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Cleave's effect",
                desc: "Deal 2 damage to two random enemy minions.",
                damage: [2],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<never> | undefined {
        return undefined;
    }

    public async doRun() {
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const card = this.route.card;
        if (!card) return;
        
        // Get all enemy minions
        const minions = [...opponent.refer.minions];
        const targets: MinionCardModel[] = [];
        
        // If there are no enemy minions, do nothing
        if (minions.length === 0) return;
        
        
        for (let i = 0; i < 2 && minions.length > 0; i++) {
            const index = Math.floor(Math.random() * minions.length);
            const target = minions[index];
            if (target) {
                targets.push(target);
                minions.splice(index, 1);
            }
        }
        
        // Deal 2 damage to each selected minion
        const damageEvents = targets.map(target => 
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: this.state.damage[0] ?? 2,
            })
        );
        DamageModel.deal(damageEvents);
    }
}

