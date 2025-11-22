import { BattlecryModel, Selector, RoleModel, DamageModel, RestoreModel, DamageType, RestoreEvent, DamageEvent } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('alexstrasza-battlecry')
export class AlexstraszaBattlecryModel extends BattlecryModel<RoleModel> {
    constructor(props?: AlexstraszaBattlecryModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Alexstrasza's Battlecry",
                desc: "Choose a character. If it's friendly, restore 8 Health. If it's an enemy, deal 8 damage.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public prepare(): Selector<RoleModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.roles; // Can target any character
        return new Selector(roles, { hint: "Choose a character" });
    }

    public run(params: RoleModel[]) {
        const target = params[0];
        if (!target) return;
        const minion = this.route.minion;
        if (!minion) return;
        const player = this.route.player;
        if (!player) return;

        // Check if target is friendly or enemy
        const isAlly = target.route.player === player;

        if (isAlly) {
            // Restore 8 Health to friendly character
            RestoreModel.deal([
                new RestoreEvent({
                    source: minion,
                    method: this,
                    target,
                    origin: 8,
                })
            ]);
        } else {
            // Deal 8 damage to enemy character
            DamageModel.deal([
                new DamageEvent({
                    type: DamageType.SPELL,
                    source: minion,
                    method: this,
                    target,
                    origin: 8,
                })
            ]);
        }
    }
}
