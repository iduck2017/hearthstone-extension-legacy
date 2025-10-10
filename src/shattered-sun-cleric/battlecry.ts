import { MinionBattlecryModel, SelectEvent, RoleModel, RoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('shattered-sun-cleric-battlecry')
export class ShatteredSunClericBattlecryModel extends MinionBattlecryModel<[RoleModel]> {
    constructor(props?: ShatteredSunClericBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Shattered Sun Cleric's Battlecry",
                desc: "Give a friendly minion +1/+1.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toRun(): [SelectEvent<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const player = this.route.player;
        if (!player) return;
        const minions = player.query(true); // Friendly minions
        if (minions.length === 0) return;
        return [new SelectEvent(minions, { hint: "Choose a friendly minion" })];
    }

    public async doRun(from: number, to: number, target: RoleModel) {
        // Give the target minion +1/+1
        const buff = new RoleBuffModel(() => ({
            state: { 
                name: "Shattered Sun Cleric's Buff",
                desc: "+1/+1",
                offset: [1, 1] // +1 Attack, +1 Health
            }
        }));
        target.child.feats.add(buff);
    }
}