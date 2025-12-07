import { BattlecryModel, DamageEvent, DamageModel, DamageType, RoleModel, Selector } from "hearthstone-core";
import { DebugService, ChunkService } from "set-piece";

@ChunkService.is('elven-archer-battlecry')
export class ElvenArcherMinionBattlecryModel extends BattlecryModel<RoleModel> {
    constructor(props?: ElvenArcherMinionBattlecryModel['props']) {
        props = props ?? {};
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

    public precheck(): Selector<RoleModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.roles;
        return new Selector(roles, { hint: 'Choose a target' });
    }

    public async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        DebugService.log(`${this.name} deals 1 damage to ${target.name}`);
        const minion = this.route.minion;
        if (!minion) return;
        DamageModel.deal([
            new DamageEvent({
                source: minion,
                method: this,
                target,
                origin: 1,
                type: DamageType.DEFAULT,
            })
        ]);  
    }

}