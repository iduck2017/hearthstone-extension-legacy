import { SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('pursuit-of-justice-effect')
export class PursuitOfJusticeEffectModel extends SpellEffectModel<[]> {
    constructor(props?: PursuitOfJusticeEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Pursuit of Justice's effect",
                desc: "Give +1 Attack to Silver Hand Recruits you summon this game.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected doRun() {
        // TODO: Implement permanent buff for Silver Hand Recruits
        // Give +1 Attack to Silver Hand Recruits you summon this game
    }
}

