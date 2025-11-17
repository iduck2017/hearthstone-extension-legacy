import { EffectModel, SpellEffectModel, RoleBuffModel } from "hearthstone-core";
import { TemplUtil } from "set-piece";

@TemplUtil.is('savage-roar-effect')
export class SavageRoarEffectModel extends SpellEffectModel<[]> {
    constructor(props?: SavageRoarEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Savage Roar's effect",
                desc: "Give your characters +2 Attack this turn.",
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
        
        // Get all friendly characters (hero and minions)
        const characters = player.query();
        
        // Give +2 Attack this turn to all friendly characters
        for (const character of characters) {
            // TODO: This should be temporary (only this turn)
            const buff = new RoleBuffModel({
                state: {
                    name: "Savage Roar's Buff",
                    desc: "+2 Attack this turn.",
                    offset: [2, 0] // +2 Attack, +0 Health
                }
            });
            character.child.feats.add(buff);
        }
    }
}

