import { Selector, SpellEffectModel, DamageModel, DamageEvent, DamageType, RoleModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('hellfire-effect')
export class HellfireEffectModel extends SpellEffectModel<never> {
    constructor(props?: HellfireEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Hellfire's effect",
                desc: "Deal 3 damage to ALL characters.",
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
        const game = this.route.game;
        if (!game) return;
        const card = this.route.card;
        if (!card) return;

        // Get all characters (heroes and minions)
        const roles = game.refer.roles;

        // Deal 3 damage to all characters
        const damageEvents = roles.map(character => 
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target: character,
                origin: 3,
            })
        );

        DamageModel.deal(damageEvents);
    }
}

