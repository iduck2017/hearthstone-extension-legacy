import { AttackModel, CardModel, ClassType, CostModel, HealthModel, LibraryUtil, MinionModel, RaceType, RarityType, RoleModel } from "hearthstone-core";
import { StoreUtil } from "set-piece";

@LibraryUtil.is('wisp')
export class WispModel extends CardModel {
    constructor(props: WispModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Wisp',
                desc: '',
                isCollectible: true,
                flavorDesc: 'If you hit an Eredar Lord with enough Wisps, it will explode. But why?',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: { 
                cost: new CostModel({ state: { origin: 0 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.UNDEAD] },
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 1 }}),
                    },
                }),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }
}
