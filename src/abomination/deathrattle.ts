import { DeathrattleModel, DamageModel, DamageEvent, DamageType, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

export namespace AbominationDeathrattleModel {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

@TemplUtil.is('abomination-deathrattle')
export class AbominationDeathrattleModel extends DeathrattleModel<
    AbominationDeathrattleModel.E,
    AbominationDeathrattleModel.S,
    AbominationDeathrattleModel.C,
    AbominationDeathrattleModel.R
> {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.list.find(item => item instanceof MinionCardModel)
        return {
            ...result,
            minion
        };
    }

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
        const minion = this.route.minion;
        if (!minion) return;

        const game = this.route.game;
        if (!game) return;

        // Get all characters (heroes and minions)
        const roles = game.query();
        
        // Deal 2 damage to all characters
        const damageEvents = roles.map(character => 
            new DamageEvent({
                type: DamageType.SPELL,
                source: minion,
                method: this,
                target: character,
                origin: 2,
            })
        );
        DamageModel.run(damageEvents);
    }
}
