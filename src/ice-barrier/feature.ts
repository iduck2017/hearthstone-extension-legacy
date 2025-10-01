import { CardFeatureModel, RoleAttackModel, RoleModel } from "hearthstone-core";
import { Event, EventUtil, Loader, StoreUtil } from "set-piece";

@StoreUtil.is('ice-barrier-feature')
export class IceBarrierFeatureModel extends CardFeatureModel {
    public get status() {
        const board = this.route.board;
        if (!board) return false;

        const player = this.route.player;
        const game = this.route.game;
        if (!player) return false;
        if (!game) return false;
        const turn = game.child.turn;
        if (turn.refer.current === player) return false;
        return true;
    }

    constructor(loader?: Loader<IceBarrierFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: {
                    name: "Ice Barrier's feature",
                    desc: "Secret: When your hero is attacked, gain 8 Armor.",
                    isActive: true,
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer }
            }
        })
    }

    @EventUtil.on(self => self.route.player?.proxy.child.hero.child.role.child.attack.event.toRecv)
    private onAttackToRun(that: RoleAttackModel, event: Event<{ target: RoleModel }>) {
        const secret = this.route.secret;
        if (!secret) return;
        if (!this.status) return;

        const player = this.route.player;
        if (!player) return;
        
        // Check if the attack target is the player's hero
        const hero = player.child.hero;
        hero.child.armor.get(8);
        
        // Trigger the secret
        secret.child.dispose.active(true);
    }
}
