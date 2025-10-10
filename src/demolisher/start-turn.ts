import { StartTurnHookModel, RoleModel, DamageModel, DamageEvent, MINION_ROUTE, MinionRoute } from "hearthstone-core";
import { TemplUtil } from "set-piece";

export namespace DemolisherFeatureProps {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = MinionRoute
}

@TemplUtil.is('demolisher-feature')
export class DemolisherFeatureModel extends StartTurnHookModel<
    DemolisherFeatureProps.E,
    DemolisherFeatureProps.S,
    DemolisherFeatureProps.C,
    DemolisherFeatureProps.R,
    DemolisherFeatureProps.P
> {
    constructor(props?: DemolisherFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Demolisher's Feature",
                desc: "At the start of your turn, deal 2 damage to a random enemy.",
                isActive: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
            route: MINION_ROUTE,
        });
    }

    protected async doRun(isCurrent: boolean) {
        if (!isCurrent) return;
        if (!this.route.board) return;

        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;

        // Get all enemy characters
        const enemies = opponent.query()
        if (enemies.length === 0) return;
        
        // Select random enemy
        const index = Math.floor(Math.random() * enemies.length);
        const target = enemies[index];
        if (!target) return;
        
        // Deal 2 damage to random enemy
        const card = this.route.card;
        if (!card) return;
        DamageModel.run([
            new DamageEvent({
                source: card,
                target: target,
                method: this,
                origin: 2,
            })
        ]);
    }
} 