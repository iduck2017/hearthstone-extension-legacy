import { EndTurnHookModel, RestoreModel, RestoreEvent } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('lightwell-end-turn')
export class LightwellEndTurnModel extends EndTurnHookModel {
    constructor(loader?: Loader<LightwellEndTurnModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Lightwell\'s End Turn',
                    desc: 'At the start of your turn, restore 3 Health to a damaged friendly character.',
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {}
            };
        });
    }

    public async doRun(isCurrent: boolean) {
        if (!isCurrent) return;
        if (!this.route.board) return;

        const player = this.route.player;
        if (!player) return;
        
        // Find damaged friendly characters (hero and minions)
        const roles = player.query()
            .filter(role => {
                const health = role.child.health;
                if (health.state.maximum > health.state.current) return true;
                return false;
            })
        
        if (!roles.length) return;

        // Choose a random damaged character
        const index = Math.floor(Math.random() * roles.length);
        const target = roles[index];
        if (!target) return;
        
        // Restore 3 Health
        const source = this.route.card;
        if (!source) return;
        
        RestoreModel.run([
            new RestoreEvent({
                source: source,
                method: this,
                target: target,
                origin: 3,
            })
        ]);
    }
}