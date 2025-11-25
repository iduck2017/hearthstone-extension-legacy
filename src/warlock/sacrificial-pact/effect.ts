import { Selector, SpellEffectModel, MinionCardModel, RestoreModel, RestoreEvent, RaceType } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('sacrificial-pact-effect')
export class SacrificialPactEffectModel extends SpellEffectModel<MinionCardModel> {
    constructor(props?: SacrificialPactEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Sacrificial Pact's effect",
                desc: "Destroy a friendly Demon. Restore 5 Health to your hero.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<MinionCardModel> | undefined {
        const player = this.route.player;
        if (!player) return;
        
        // Only target friendly Demons
        const roles = player.refer.minions.filter(minion => 
            minion.state.races.includes(RaceType.DEMON)
        );
        return new Selector(roles, { hint: "Choose a friendly Demon" });
    }

    public async doRun(params: Array<MinionCardModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const player = this.route.player;
        if (!player) return;
        const card = this.route.card;
        if (!card) return;
        const hero = player.child.hero;
        
        // Check if the target is a friendly Demon
        if (target.route.player !== player) return;
        if (!target.state.races.includes(RaceType.DEMON)) return;
        
        // Destroy the friendly Demon
        target.child.dispose.destroy(card, this);
        
        // Restore 5 Health to your hero
        RestoreModel.deal([
            new RestoreEvent({
                source: card,
                method: this,
                target: hero,
                origin: 5,
            })
        ]);
    }
}

