import { DeathrattleModel, DamageModel, DamageEvent, DamageType, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";



@TemplUtil.is('abomination-deathrattle')
export class AbominationDeathrattleModel extends DeathrattleModel {

    constructor(props?: AbominationDeathrattleModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Abomination's Deathrattle",
                desc: "Deal 2 damage to ALL characters.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public async doRun() {
        const card = this.route.card;
        if (!card) return;

        const game = this.route.game;
        if (!game) return;

        // Get all characters (heroes and minions)
        const roles = game.query();
        
        // Deal 2 damage to all characters
        const damageEvents = roles.map(character => 
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target: character,
                origin: 2,
            })
        );
        DamageModel.deal(damageEvents);
    }
}
