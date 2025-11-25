import { TurnEndModel, MinionCardModel, BaseFeatureModel, RoleHealthBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('blood-imp-feature')
export class BloodImpFeatureModel extends TurnEndModel {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            minion
        };
    }

    constructor(props?: BloodImpFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Blood Imp's Feature",
                desc: "At the end of your turn, give another random friendly minion +1 Health.",
                isEnabled: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        });
    }

    protected doRun() {
        const player = this.route.player;
        if (!player) return;
        const minion = this.route.minion;
        if (!minion) return;

        // Check if it's the current player's turn
        const game = this.route.game;
        if (!game) return;
        if (game.child.turn.refer.current !== player) return;

        // Get all friendly minions except this one
        const minions = player.refer.minions.filter(m => m !== minion);
        if (minions.length === 0) return;

        // Select a random friendly minion
        const index = Math.floor(Math.random() * minions.length);
        const target = minions[index];
        if (!target) return;

        // Give the target +1 Health
        target.buff(new BaseFeatureModel({
            state: {
                name: "Blood Imp's Buff",
                desc: "+1 Health.",
            },
            child: {
                buffs: [new RoleHealthBuffModel({ state: { offset: 1 } })]
            },
        }));
    }
}

