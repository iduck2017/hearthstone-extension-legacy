import { MinionBattlecryModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
// TODO: Implement Choose One mechanic and Transform
// This card has two options:
// 1. Transform into a 7/6 with Rush
// 2. Transform into a 4/9 with Taunt
// Need to create the transformed minion models

@TemplUtil.is('druid-of-the-claw-battlecry')
export class DruidOfTheClawBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(props?: DruidOfTheClawBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Druid of the Claw Battlecry',
                desc: 'Choose One - Transform into a 7/6 with Rush; or a 4/9 with Taunt.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toRun(): [] { return []; }

    public doRun(from: number, to: number) {
        // TODO: Implement Choose One mechanic and Transform
        // Need to implement the Choose One selection system
        // Option 1: Transform into a 7/6 with Rush
        // Option 2: Transform into a 4/9 with Taunt
        // const minion = this.route.minion;
        // if (!minion) return;
        // const catForm = new DruidOfTheClawCatFormModel();
        // const bearForm = new DruidOfTheClawBearFormModel();
        // minion.transform(catForm or bearForm based on choice);
    }
}

