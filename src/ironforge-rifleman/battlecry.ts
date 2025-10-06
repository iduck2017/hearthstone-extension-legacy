import { MinionBattlecryModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('ironforge-rifleman-battlecry')
export class IronforgeRiflemanBattlecryModel extends MinionBattlecryModel<[RoleModel]> {
    constructor(loader?: Loader<IronforgeRiflemanBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Ironforge Rifleman's Battlecry",
                    desc: "Deal 1 damage.",
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
        const roles = games.query(); // Can target any character
        return [new SelectEvent(roles, { hint: "Choose a target" })];
    }

    public async doRun(from: number, to: number, target: RoleModel) {
        const card = this.route.card;
        if (!card) return;
        // Deal 1 damage to the target
        DamageModel.run([
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
