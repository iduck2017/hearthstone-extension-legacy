import { DeathrattleModel, DamageModel, DamageType, DamageEvent } from "hearthstone-core";
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

    public run() {
        const minion = this.route.minion;
        if (!minion) return;
        const game = this.route.game;
        if (!game) return;

        // Get all characters (heroes and minions)
        const roles = game.refer.roles;
        
        // Deal 2 damage to all characters
        DamageModel.deal(
            roles.map(character => new DamageEvent({
                type: DamageType.SPELL,
                source: minion,
                method: this,
                target: character,
                origin: 2,
            }))
        );
    }
}
