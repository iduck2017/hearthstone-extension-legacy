import { MinionCardModel, MinionBattlecryModel, RoleModel, Selector } from "hearthstone-core";
import { AbusiveSergeantBuffModel } from "./buff";
import { DebugUtil, TemplUtil } from "set-piece";

@TemplUtil.is('abusive-sergeant-battlecry')
export class AbusiveSergeantBattlecryModel extends MinionBattlecryModel<[RoleModel]> {
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

    public toRun(): [Selector<RoleModel>] | undefined {
        const game = this.route.game;
        if (!game) return;
        const options = game.query(true);
        if (!options.length) return;
        return [new Selector(options, { hint: 'Choose a minion' })];
    }

    public async doRun(from: number, to: number, target: RoleModel) {
        target.child.feats.add(new AbusiveSergeantBuffModel())
    }
}