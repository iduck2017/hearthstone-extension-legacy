import { MinionBattlecryModel, Selector, MinionCardModel, RoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('aldor-peacekeeper-battlecry')
export class AldorPeacekeeperBattlecryModel extends MinionBattlecryModel<[MinionCardModel]> {
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
            refer: { ...props.refer }
        });
    }

    public toRun(): [Selector<MinionCardModel>] | undefined {
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const minions = opponent.query(true);
        if (minions.length === 0) return;
        return [new Selector(minions, { hint: "Choose an enemy minion" })];
    }

    public doRun(from: number, to: number, target: MinionCardModel) {
        const player = this.route.player;
        if (!player) return;
        
        if (target.route.player === player) return;
        
        const currentAttack = target.child.attack.state.current;
        const buff = new RoleBuffModel({
            state: {
                name: "Aldor Peacekeeper's Buff",
                desc: "Attack changed to 1.",
                offset: [1 - currentAttack, 0]
            }
        });
        target.child.feats.add(buff);
    }
}

