import { MinionBattlecryModel, Selector, RoleModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('ironforge-rifleman-battlecry')
export class IronforgeRiflemanBattlecryModel extends MinionBattlecryModel<[RoleModel]> {
    constructor(props?: IronforgeRiflemanBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Ironforge Rifleman's Battlecry",
                desc: "Deal 1 damage.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toRun(): [Selector<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(); // Can target any character
        return [new Selector(roles, { hint: "Choose a target" })];
    }

    public doRun(from: number, to: number, target: RoleModel) {
        const card = this.route.card;
        if (!card) return;
        // Deal 1 damage to the target
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: 1,
            })
        ]);
    }
}
