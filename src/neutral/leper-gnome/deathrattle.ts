import { DamageModel, DamageType, DeathrattleModel, DamageEvent, MinionCardModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('leper-gnome-deathrattle')
export class LeperGnomeDeathrattleModel extends DeathrattleModel {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            minion
        };
    }

    constructor(props?: LeperGnomeDeathrattleModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Leper Gnome\'s Deathrattle',
                desc: 'Deal 2 damage to the enemy hero.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public doRun() {
        const minion = this.route.minion;
        if (!minion) return;
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const target = opponent.child.hero;
        DamageModel.deal([
            new DamageEvent({
                source: minion,
                method: this,
                target,
                origin: 2,
                type: DamageType.DEFAULT,
            })
        ]);
    }
}