import { MinionBattlecryModel, DamageModel, DamageEvent } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('flame-imp-battlecry')
export class FlameImpBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(loader?: Loader<FlameImpBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Flame Imp's Battlecry",
                    desc: "Deal 3 damage to your hero.",
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }

    public toRun(): [] | undefined {
        return [];
    }

    public async doRun(from: number, to: number) {
        // Deal 3 damage to your hero
        const card = this.route.card;
        if (!card) return;
        const player = this.route.player;
        if (!player) return;
        const hero = player.child.hero;
        
        DamageModel.run([
            new DamageEvent({
                source: card,
                target: hero.child.role,
                method: this,
                origin: 3,
            })]
        );
    }
}
