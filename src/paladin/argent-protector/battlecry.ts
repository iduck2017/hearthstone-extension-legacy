import { BattlecryModel, Selector, MinionCardModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('argent-protector-battlecry')
export class ArgentProtectorBattlecryModel extends BattlecryModel<MinionCardModel> {
    constructor(props?: ArgentProtectorBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Argent Protector's Battlecry",
                desc: "Give a friendly minion Divine Shield.",
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
        
        // Check if the target is a friendly minion
        if (target.route.player !== player) return;
        
        // Give the minion Divine Shield
        const divineShield = target.child.divineShield;
        divineShield.enable();
    }
}

