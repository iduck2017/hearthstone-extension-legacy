import { SpellEffectModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('eye-for-an-eye-effect')
export class EyeForAnEyeEffectModel extends SpellEffectModel<[]> {
    constructor(props?: EyeForAnEyeEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Eye for an Eye's effect",
                desc: "Secret: When your hero takes damage, deal that much damage to the enemy hero.",
                damage: [],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return [] }

    protected doRun() {
        // TODO: Implement Secret mechanic
        // When hero takes damage, deal that much damage to enemy hero
    }
}

