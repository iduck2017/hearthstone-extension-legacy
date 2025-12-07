import { DeathrattleModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('tirion-fordring-deathrattle')
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
        // TODO: Equip a 5/3 Ashbringer weapon
        // This requires creating and equipping a weapon card
    }
}

