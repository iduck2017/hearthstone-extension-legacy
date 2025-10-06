import { MinionBattlecryModel, SelectEvent, RoleModel, DamageModel, DamageEvent, RestoreModel, RestoreEvent, DamageType } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('alexstrasza-battlecry')
export class AlexstraszaBattlecryModel extends MinionBattlecryModel<[RoleModel]> {
    constructor(loader?: Loader<AlexstraszaBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Alexstrasza's Battlecry",
                    desc: "Choose a character. If it's friendly, restore 8 Health. If it's an enemy, deal 8 damage.",
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
        return [new SelectEvent(roles, { hint: "Choose a character" })];
    }

    public async doRun(from: number, to: number, target: RoleModel) {
        const card = this.route.card;
        const player = this.route.player;
        if (!card || !player) return;

        // Check if target is friendly or enemy
        const isAlly = target.route.player === player;

        if (isAlly) {
            // Restore 8 Health to friendly character
            RestoreModel.run([
                new RestoreEvent({
                    source: card,
                    method: this,
                    target,
                    origin: 8,
                })
            ]);
        } else {
            // Deal 8 damage to enemy character
            DamageModel.run([
                new DamageEvent({
                    type: DamageType.SPELL,
                    source: card,
                    method: this,
                    target,
                    origin: 8,
                })
            ]);
        }
    }
}
