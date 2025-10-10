import { MinionBattlecryModel, SelectEvent, RoleModel } from "hearthstone-core";
import { Loader, TemplUtil } from "set-piece";

@TemplUtil.is('frost-elemental-battlecry')
export class FrostElementalBattlecryModel extends MinionBattlecryModel<[RoleModel]> {
    constructor(loader?: Loader<FrostElementalBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Frost Elemental's Battlecry",
                    desc: "Freeze a character.",
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }

    public toRun(): [SelectEvent<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        
        // Can target any character
        const roles = games.query();
        return [new SelectEvent(roles, { hint: "Choose a character" })];
    }

    public async doRun(from: number, to: number, target: RoleModel) {
        // Freeze the target
        const feats = target.child.feats;
        const frozen = feats.child.frozen;
        frozen.active();
    }
}
