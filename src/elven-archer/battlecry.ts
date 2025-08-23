import { MinionModel, BattlecryModel, RoleModel, DamageType, SelectEvent, AnchorModel, DamageUtil, DamageEvent } from "hearthstone-core";

export class ElvenArcherBattlecryModel extends BattlecryModel<[RoleModel]> {
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

    public toRun(): [SelectEvent<RoleModel>] | undefined {
        const player = this.route.player;
        const game = this.route.game;
        if (!game) return;
        if (!player) return;
        const options = game.refer.roles;
        if (options.length === 0) return;
        return [new SelectEvent(options, { hint: 'Choose a target' })]
    }

    public async doRun(target: RoleModel) {
        const card = this.route.card;
        if (!card) return;
        DamageUtil.run([
            new DamageEvent({
                source: this.child.anchor,
                target,
                origin: 1,  
                type: DamageType.DEFAULT,
            })
        ])
    }
}