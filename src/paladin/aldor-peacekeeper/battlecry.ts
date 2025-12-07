import { BattlecryModel, Selector, MinionCardModel, BaseFeatureModel, RoleAttackBuffModel, OperatorType } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('aldor-peacekeeper-battlecry')
export class AldorPeacekeeperBattlecryModel extends BattlecryModel<MinionCardModel> {
    constructor(props?: AldorPeacekeeperBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Aldor Peacekeeper's Battlecry",
                desc: "Change an enemy minion's Attack to 1.",
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
        
        // Check if the target is an enemy minion
        if (target.route.player === player) return;
        
        // Change the minion's Attack to 1 using SET operator
        target.buff(new BaseFeatureModel({
            state: {
                name: "Aldor Peacekeeper's Buff",
                desc: "Attack changed to 1.",
            },
            child: {
                buffs: [new RoleAttackBuffModel({ 
                    state: { 
                        offset: 1,
                        type: OperatorType.SET
                    } 
                })]
            },
        }));
    }
}

