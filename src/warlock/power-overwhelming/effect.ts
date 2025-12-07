import { Selector, SpellEffectModel, MinionCardModel, BaseFeatureModel, RoleAttackBuffModel, RoleHealthBuffModel, TurnEndModel, IRoleBuffModel } from "hearthstone-core";
import { ChunkService, TranxService } from "set-piece";

@ChunkService.is('power-overwhelming-effect')
export class PowerOverwhelmingEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: PowerOverwhelmingEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Power Overwhelming's effect",
                desc: "Give a friendly minion +4/+4 until end of turn. Then, it dies. Horribly.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<MinionCardModel> | undefined {
        const player = this.route.player;
        if (!player) return;
        
        // Only target friendly minions
        const roles = player.refer.minions;
        return new Selector(roles, { hint: "Choose a friendly minion" });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const player = this.route.player;
        if (!player) return;
        const card = this.route.card;
        if (!card) return;

        // Give the minion +4/+4 until end of turn
        const buff = new PowerOverwhelmingBuffModel({
            refer: {
                player,
                card
            }
        });
        target.buff(buff);
    }
}

@ChunkService.is('power-overwhelming-buff')
class PowerOverwhelmingBuffModel extends BaseFeatureModel implements IRoleBuffModel {
    constructor(props?: PowerOverwhelmingBuffModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Power Overwhelming's Buff",
                desc: "+4/+4 until end of turn. Then, it dies.",
                ...props.state
            },
            child: {
                buffs: [
                    new RoleAttackBuffModel({ state: { offset: 4 } }),
                    new RoleHealthBuffModel({ state: { offset: 4 } })
                ],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }

    @TranxService.span()
    onEnd() {
        const role = this.route.role;
        if (!role) return;
        const minion = role as MinionCardModel;
        const card = this.route.refer?.card;
        if (!card) return;

        // At the end of turn, destroy the minion
        minion.child.dispose.destroy(card, this);
    }
}

