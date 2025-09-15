// // Murloc Tidehunter Battlecry - Summon a 1/1 Murloc Scout

// import { RoleBattlecryModel } from "hearthstone-core";
// import { MurlocScoutModel } from "../../backup/src/murloc-scout";
// import { Loader, StoreUtil } from "set-piece";

// @StoreUtil.is('murloc-tidehunter-battlecry')
// export class MurlocTidehunterRoleBattlecryModel extends RoleBattlecryModel<[]> {
//     constructor(loader?: Loader<MurlocTidehunterRoleBattlecryModel>) {
//         super(() => {
//             const props = loader?.() ?? {};
//             return {
//                 uuid: props.uuid,
//                 state: {
//                     name: 'Murloc Tidehunter\'s Battlecry',
//                     desc: 'Summon a 1/1 Murloc Scout.',
//                     ...props.state
//                 },
//                 child: { ...props.child },
//                 refer: { ...props.refer }
//             }
//         });
//     }

//     public toRun(): [] { return []; }

//     public async doRun() {
//         const player = this.route.player;
//         if (!player) return;
//         const card = this.route.card;
//         const board = player.child.board;
//         const roles = board.child.minions;
//         const position = roles.findIndex(item => item === card);
        
//         const target = new MurlocScoutModel({});
//         const minion = target.child.minion;
//         if (!minion) return;
//         minion.summon(board, position + 1);
//     }
// }
