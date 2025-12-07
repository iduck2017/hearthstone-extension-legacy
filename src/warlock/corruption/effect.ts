import { Selector, SpellEffectModel, MinionCardModel, TurnStartModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('corruption-effect')
export class CorruptionEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: CorruptionEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Corruption's effect",
                desc: "Choose an enemy minion. At the start of your turn, destroy it.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<MinionCardModel> | undefined {
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        
        // Only target enemy minions
        const roles = opponent.refer.minions;
        return new Selector(roles, { hint: "Choose an enemy minion" });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const player = this.route.player;
        if (!player) return;
        const card = this.route.card;
        if (!card) return;

        // Apply a feature to the target that will destroy it at the start of the player's turn
        target.buff(new CorruptionFeatureModel({
            refer: {
                player,
                card
            }
        }));
    }
}

@ChunkService.is('corruption-feature')
class CorruptionFeatureModel extends TurnStartModel {
    constructor(props?: CorruptionFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Corruption's Feature",
                desc: "At the start of your turn, destroy this minion.",
                isEnabled: true,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        });
    }

    protected doRun(isCurrent: boolean) {
        if (!isCurrent) return;
        const player = this.route.player;
        if (!player) return;
        const role = this.route.role;
        if (!role) return;
        const minion = role as MinionCardModel;
        const card = this.route.refer?.card;
        if (!card) return;

        // Check if it's the player who cast Corruption's turn
        const game = this.route.game;
        if (!game) return;
        if (game.child.turn.refer.current !== player) return;

        // Destroy the minion
        minion.child.dispose.destroy(card, this);
    }
}

