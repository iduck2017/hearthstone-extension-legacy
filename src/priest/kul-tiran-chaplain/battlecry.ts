import { MinionBattlecryModel, Selector, RoleModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { KulTiranChaplainBuffModel } from "./buff";

@TemplUtil.is('kul-tiran-chaplain-battlecry')
export class KulTiranChaplainBattlecryModel extends MinionBattlecryModel<[RoleModel]> {
    constructor(props?: KulTiranChaplainBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Kul Tiran Chaplain\'s Battlecry',
                desc: 'Give a friendly minion +2 Health.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toRun(): [Selector<RoleModel>] | undefined {
        const player = this.route.player;
        if (!player) return;
        
        // Only target friendly minions
        const roles = player.query(true);
        if (roles.length === 0) return; // No valid targets
        
        return [new Selector(roles, { hint: "Choose a friendly minion" })];
    }

    public doRun(from: number, to: number, target: RoleModel) {
        const player = this.route.player;
        if (!player) return;
        
        // Check if the target is a friendly minion
        if (target.route.player !== player) return;
        
        // Apply +2 Health buff
        const buff = new KulTiranChaplainBuffModel();
        target.child.feats.add(buff);
    }
}
