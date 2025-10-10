import { MinionBattlecryModel, RoleModel } from "hearthstone-core";
import { Loader, TemplUtil } from "set-piece";

@TemplUtil.is('stampeding-kodo-battlecry')
export class StampedingKodoBattlecryModel extends MinionBattlecryModel<[]> {
    constructor(loader?: Loader<StampedingKodoBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Stampeding Kodo's Battlecry",
                    desc: "Destroy a random enemy minion with 2 or less Attack.",
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }

    public toRun(): [] | undefined {
        // No target selection needed
        return [];
    }

    public async doRun(from: number, to: number) {
        const card = this.route.card;
        if (!card) return;

        const player = this.route.player;
        const opponent = player?.refer.opponent;
        if (!opponent) return;

        // Find enemy minions with 2 or less attack
        const roles = opponent.query(true)
            .filter(item => item.child.attack.state.current <= 2);
        if (roles.length === 0) return;

        // Randomly select one target
        const index = Math.floor(Math.random() * roles.length);
        const role = roles[index];
        
        // Destroy the target
        const minion = role?.route.minion;
        minion?.child.dispose.active(true, card, this);
    }
}
