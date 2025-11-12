import { SpellEffectModel, DivineShieldModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('righteousness-effect')
export class RighteousnessEffectModel extends SpellEffectModel<[]> {
    constructor(props?: RighteousnessEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Righteousness's effect",
                desc: "Give your minions Divine Shield.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected doRun() {
        const player = this.route.player;
        if (!player) return;
        
        const minions = player.query(true);
        for (const minion of minions) {
            const divineShield = minion.child.feats.child.divineShield;
            if (!divineShield) {
                minion.child.feats.add(new DivineShieldModel({ state: { isActive: true } }));
            } else {
                divineShield.active();
            }
        }
    }
}

