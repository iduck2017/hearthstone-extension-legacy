import { EndTurnHookModel, MinionCardModel, RoleBuffModel } from "hearthstone-core";
import { DebugUtil, TemplUtil } from "set-piece";


@TemplUtil.is('ethereal-arcanist-end-turn')
export class EtherealArcanistFeatureModel extends EndTurnHookModel {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            minion
        };
    }

    constructor(props?: EtherealArcanistFeatureModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Ethereal Arcanist\'s Hook',
                desc: 'If you control a Secret at the end of your turn, gain +2/+2.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    protected run(isCurrent: boolean) {
        if (!isCurrent) return;

        const player = this.route.player;
        if (!player) return;
        const minion = this.route.minion;
        if (!minion) return;

        // Check if player controls any secrets
        const board = player.child.board;
        const secrets = board.child.secrets;
        if (!secrets.length) return;

        minion.buff(new RoleBuffModel({
            state: {
                name: "Ethereal Arcanist's Buff",
                desc: "+2/+2.",
                offset: [2, 2]
            }
        }));
    }
}
