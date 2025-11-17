import { MinionBattlecryModel, RoleBuffModel, TauntModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
// TODO: Implement Choose One mechanic
// This card has two options:
// 1. +5 Attack
// 2. +5 Health and Taunt

@TemplUtil.is('ancient-of-war-battlecry')
export class AncientOfWarBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(props?: AncientOfWarBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Ancient of War Battlecry',
                desc: 'Choose One - +5 Attack; or +5 Health and Taunt.',
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
        // Option 1: +5 Attack
        // Option 2: +5 Health and Taunt
        // const minion = this.route.minion;
        // if (!minion) return;
        // if (choice === 'attack') {
        //     minion.child.feats.add(new RoleBuffModel({
        //         state: {
        //             name: "Ancient of War's Attack Buff",
        //             desc: "+5 Attack.",
        //             offset: [5, 0]
        //         }
        //     }));
        // } else {
        //     minion.child.feats.add(new RoleBuffModel({
        //         state: {
        //             name: "Ancient of War's Health Buff",
        //             desc: "+5 Health.",
        //             offset: [0, 5]
        //         }
        //     }));
        //     const taunt = minion.child.feats.child.taunt;
        //     if (!taunt) {
        //         minion.child.feats.add(new TauntModel({ state: { isActive: true } }));
        //     } else {
        //         taunt.active();
        //     }
        // }
    }
}

