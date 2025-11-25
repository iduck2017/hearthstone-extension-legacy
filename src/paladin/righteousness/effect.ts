import { Selector, SpellEffectModel, MinionCardModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('righteousness-effect')
export class RighteousnessEffectModel extends SpellEffectModel<never> {
    constructor(props?: RighteousnessEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Righteousness's effect",
                desc: "Give your minions Divine Shield.",
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public precheck(): Selector<never> | undefined {
        return undefined;
    }

    public async doRun() {
        const player = this.route.player;
        if (!player) return;

        // Get all friendly minions
        const minions = player.refer.minions;

        // Give Divine Shield to all friendly minions
        for (const minion of minions) {
            const divineShield = minion.child.divineShield;
            divineShield.enable();
        }
    }
}

