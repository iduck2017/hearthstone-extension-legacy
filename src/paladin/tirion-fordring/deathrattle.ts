import { DeathrattleModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { AshbringerModel } from "../ashbringer";

@TemplUtil.is('tirion-fordring-deathrattle')
export class TirionFordringDeathrattleModel extends DeathrattleModel {
    constructor(props?: TirionFordringDeathrattleModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Tirion Fordring's Deathrattle",
                desc: "Equip a 5/3 Ashbringer.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        });
    }

    public doRun() {
        const player = this.route.player;
        if (!player) return;
        const hero = player.child.hero;
        
        // Equip a 5/3 Ashbringer
        const ashbringer = new AshbringerModel();
        hero.equip(ashbringer);
    }
}

