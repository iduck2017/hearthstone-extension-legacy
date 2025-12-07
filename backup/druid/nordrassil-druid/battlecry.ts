import { MinionBattlecryModel } from "hearthstone-core";
import { ChunkService } from "set-piece";
import { NordrassilDruidContextModel } from "./context";

@ChunkService.is('nordrassil-druid-battlecry')
export class NordrassilDruidBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(props?: NordrassilDruidBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Nordrassil Druid Battlecry',
                desc: 'The next spell you cast this turn costs (3) less.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toRun(): [] { return []; }

    public doRun(from: number, to: number) {
        const player = this.route.player;
        if (!player) return;
        player.add(new NordrassilDruidContextModel());
    }
}

