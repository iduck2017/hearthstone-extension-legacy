import { MinionCardModel, BattlecryModel, RoleModel, TargetType, Selector } from "hearthstone-core";

export class ElvenArcherBattlecryModel extends BattlecryModel<
    [RoleModel],
    MinionCardModel
> {
    constructor(props: ElvenArcherBattlecryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Elven Archer Battlecry',
                desc: 'Deal 1 damage.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public preparePlay(): [Selector<RoleModel>] | undefined {
        if (!this.route.game) return;
        const candidates = this.route.game.query(TargetType.Role, {})
        if (candidates.length === 0) return;
        return [new Selector(candidates, 'Choose a target')]
    }

    public async run(target: RoleModel) {
        const role = this.route.parent?.child.role;
        if (!role) return;
        role.dealDamage(target, 1);
    }
}