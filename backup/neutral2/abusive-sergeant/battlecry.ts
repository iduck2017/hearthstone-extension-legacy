import { MinionCardModel, BattlecryModel, RoleModel, Selector } from "hearthstone-core";
import { AbusiveSergeantBuffModel } from "./buff";
import { TemplUtil } from "set-piece";

@TemplUtil.is('abusive-sergeant-battlecry')
export class AbusiveSergeantBattlecryModel extends BattlecryModel<RoleModel> {
    constructor(props?: AbusiveSergeantBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant\'s Battlecry',
                desc: '+2 Attack this turn.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public prepare(): Selector<RoleModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const options = game.refer.minions;
        if (!options.length) return;
        return new Selector(options, { hint: 'Choose a minion' });
    }

    public run(params: RoleModel[]) {
        const target = params[0];
        if (!target) return;
        target.buff(new AbusiveSergeantBuffModel());
    }
}