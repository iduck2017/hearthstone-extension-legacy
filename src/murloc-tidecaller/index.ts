import { AttackModel, CardModel, ClassType, FeaturesModel, HealthModel, MinionModel, RaceType, RarityType, RoleModel } from "hearthstone-core";
import { MurlocTidecallerFeatureModel } from "./feature";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";

@LibraryUtil.is('murloc-tidecaller')
export class MurlocTidecallerModel extends CardModel {
    constructor(props: MurlocTidecallerModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Murloc Tidecaller',
                desc: 'Whenever your summon a Murloc, gain +1 Attack.',
                flavorDesc: '',
                rarity: RarityType.RARE,
                class: ClassType.NEUTRAL,
                ...props.state,
            },
            child: {
                cost: new CostModel({ state: { origin: 1 }}),
                minion: new MinionModel({
                    state: { races: [RaceType.MURLOC] },
                    child: {
                        attack: new AttackModel({ state: { origin: 1 }}),
                        health: new HealthModel({ state: { origin: 2 }}),
                        features: new FeaturesModel({
                            child: {
                                items: [new MurlocTidecallerFeatureModel({})]
                            }
                        })
                    },
                })
            },
            refer: { ...props.refer }
        });
    }
}