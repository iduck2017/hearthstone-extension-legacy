import { MinionModel, BattlecryModel, RoleModel, DamageType, SelectEvent, AnchorModel, DamageUtil, DamageEvent } from "hearthstone-core";
import { StoreUtil } from "set-piece";

@StoreUtil.is('ironforge-rifleman-battlecry')
export class IronforgeRiflemanBattlecryModel extends BattlecryModel<[RoleModel]> {
    constructor(props: IronforgeRiflemanBattlecryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Ironforge Rifleman Battlecry',
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
        // Deal 1 damage to the selected target
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