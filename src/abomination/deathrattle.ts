import { DeathrattleModel, DamageModel, DamageEvent, DamageType, MinionRoute, MINION_ROUTE } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

export namespace AbominationDeathrattleProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = MinionRoute
}

@StoreUtil.is('abomination-deathrattle')
export class AbominationDeathrattleModel extends DeathrattleModel<
    AbominationDeathrattleProps.E,
    AbominationDeathrattleProps.S,
    AbominationDeathrattleProps.C,
    AbominationDeathrattleProps.R,
    AbominationDeathrattleProps.P
> {
    constructor(loader?: Loader<AbominationDeathrattleModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Abomination's Deathrattle",
                    desc: "Deal 2 damage to ALL characters.",
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: MINION_ROUTE,
            };
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
