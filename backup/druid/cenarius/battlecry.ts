import { MinionBattlecryModel, RoleBuffModel, TauntModel } from "hearthstone-core";
import { ChunkService } from "set-piece";
// TODO: Implement Choose One mechanic
// This card has two options:
// 1. Give your other minions +2/+2
// 2. Summon two 2/2 Treants with Taunt

@ChunkService.is('cenarius-battlecry')
export class CenariusBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(props?: CenariusBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Cenarius Battlecry',
                desc: 'Choose One - Give your other minions +2/+2; or Summon two 2/2 Treants with Taunt.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toRun(): [] { return []; }

    public doRun(from: number, to: number) {
        // TODO: Implement Choose One mechanic
        // Need to implement the Choose One selection system
        // Option 1: Give your other minions +2/+2
        // Option 2: Summon two 2/2 Treants with Taunt (need Treant model)
        // const player = this.route.player;
        // if (!player) return;
        // const minion = this.route.minion;
        // if (!minion) return;
        // if (choice === 'buff') {
        //     const minions = player.query(true).filter(m => m !== minion);
        //     for (const m of minions) {
        //         m.child.feats.add(new RoleBuffModel({
        //             state: {
        //                 name: "Cenarius's Buff",
        //                 desc: "+2/+2.",
        //                 offset: [2, 2]
        //             }
        //         }));
        //     }
        // } else {
        //     const board = player.child.board;
        //     for (let i = 0; i < 2; i++) {
        //         const treant = new TreantModel();
        //         treant.child.feats.add(new TauntModel({ state: { isActive: true } }));
        //         treant.deploy(board);
        //     }
        // }
    }
}

