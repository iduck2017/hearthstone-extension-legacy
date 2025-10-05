import { EffectModel, SpellEffectModel, RestoreModel, RestoreEvent } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('radiance-effect')
export class RadianceEffectModel extends SpellEffectModel<[]> {
    constructor(loader?: Loader<RadianceEffectModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: "Radiance's effect",
                    desc: "Restore 5 Health to your hero.",
                    damage: [],
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
            };
        });
    }

    toRun(): [] {
        // No target selection needed - always targets the hero
        return [];
    }

    protected async doRun() {
        const player = this.route.player;
        if (!player) return;
        const card = this.route.card;
        if (!card) return;
        const hero = player.child.hero;
        
        // Restore 5 Health to the hero
        await RestoreModel.run([
            new RestoreEvent({
                source: card,
                method: this,
                target: hero.child.role,
                origin: 5,
            })
        ]);
    }
}
