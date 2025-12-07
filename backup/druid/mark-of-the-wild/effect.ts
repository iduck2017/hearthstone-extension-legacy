import { Selector, RoleModel, MinionCardModel, SpellEffectModel, TauntModel, RoleBuffModel } from "hearthstone-core";
import { ChunkService } from "set-piece";

@ChunkService.is('mark-of-the-wild-effect')
export class MarkOfTheWildEffectModel extends SpellEffectModel<[MinionCardModel]> {
    constructor(props?: MarkOfTheWildEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Mark of the Wild's effect",
                desc: "Give a minion Taunt and +2/+3.",
                damage: [],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [Selector<MinionCardModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.query(true);
        return [new Selector(roles, { hint: "Choose a minion" })]
    }

    protected doRun(target: MinionCardModel) {
        // Give +2/+3 buff
        const buff = new RoleBuffModel({
            state: {
                name: "Mark of the Wild's Buff",
                desc: "+2/+3.",
                offset: [2, 3] // +2 Attack, +3 Health
            }
        });
        target.child.feats.add(buff);
        
        // Give Taunt
        const taunt = target.child.feats.child.taunt;
        if (!taunt) {
            target.child.feats.add(new TauntModel({ state: { isActive: true } }));
        } else {
            taunt.active();
        }
    }
}

