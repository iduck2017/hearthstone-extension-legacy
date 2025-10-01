import { SecretFeatureModel } from "hearthstone-core";
import { Loader } from "set-piece";

export class SpellbenderFeatureModel extends SecretFeatureModel {
    constructor(loader?: Loader<SpellbenderFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: {
                    name: "Spellbender's feature",
                    desc: "When an enemy casts a spell on a minion, summon a 1/3 as the new target.",
                    isActive: true,
                    ...props.state
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        })
    }

    
}