import { BattlecryModel, Selector, RoleModel, RoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('shattered-sun-cleric-battlecry')
export class ShatteredSunClericBattlecryModel extends BattlecryModel<RoleModel> {
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

    public precheck(): Selector<RoleModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const player = this.route.player;
        if (!player) return;
        const minions = player.refer.minions; // Friendly minions
        if (minions.length === 0) return;
        return new Selector(minions, { hint: "Choose a friendly minion" });
    }

    public async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        // Give the target minion +1/+1
        const buff = new RoleBuffModel({
            state: { 
                name: "Shattered Sun Cleric's Buff",
                desc: "+1/+1",
                offset: [1, 1] // +1 Attack, +1 Health
            }
        });
        target.buff(buff);
    }
}