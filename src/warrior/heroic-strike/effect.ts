import { Selector, SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";
import { HeroicStrikeBuffModel } from "./buff";

@TemplUtil.is('heroic-strike-effect')
export class HeroicStrikeEffectModel extends SpellEffectModel<never> {
    constructor(props?: HeroicStrikeEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Heroic Strike's effect",
                desc: "Give your hero +4 Attack this turn.",
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
        const hero = player.child.hero;
        
        // Give hero +4 Attack this turn
        const buff = new HeroicStrikeBuffModel();
        hero.buff(buff);
    }
}

