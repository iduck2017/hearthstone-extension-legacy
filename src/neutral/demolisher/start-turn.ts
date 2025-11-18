import { TurnStartModel, DamageModel, DamageType, DamageEvent, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('demolisher-feature')
export class DemolisherFeatureModel extends TurnStartModel {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            minion
        };
    }

    constructor(props?: DemolisherFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Demolisher's Feature",
                desc: "At the start of your turn, deal 2 damage to a random enemy.",
                actived: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        });
    }

    protected run(isCurrent: boolean) {
        if (!isCurrent) return;

        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;

        // Get all enemy characters
        const enemies = opponent.refer.roles;
        if (enemies.length === 0) return;
        
        // Select random enemy
        const index = Math.floor(Math.random() * enemies.length);
        const target = enemies[index];
        if (!target) return;
        
        // Deal 2 damage to random enemy
        const minion = this.route.minion;
        if (!minion) return;
        DamageModel.deal([
            new DamageEvent({
                source: minion,
                target: target,
                method: this,
                origin: 2,
                type: DamageType.SPELL,
            })
        ]);
    }
} 