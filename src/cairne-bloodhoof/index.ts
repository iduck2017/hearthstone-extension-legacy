import { MinionCardModel, RarityType, ClassType, RaceType, RoleAttackModel, RoleHealthModel, RoleModel, RoleFeatsModel, TauntModel, MinionFeatsModel, CostModel, LibraryUtil } from "hearthstone-core";
import { CairneBloodhoofDeathrattleModel } from "./deathrattle";

@LibraryUtil.is('cairne-bloodhoof')
export class CairneBloodhoofModel extends MinionCardModel {
    constructor(props?: CairneBloodhoofModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Cairne Bloodhoof",
                desc: "Taunt Deathrattle: Summon a 5/5 Baine Bloodhoof.",
                flavorDesc: "Cairne was killed by Garrosh, so... don't put this guy in a Warrior deck. It's pretty insensitive.",
                rarity: RarityType.LEGENDARY,
                class: ClassType.NEUTRAL,
                races: [],
                isCollectible: true,
                ...props.state
            },
            child: {
                cost: new CostModel({ state: { origin: 6 }}),
                role: new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 5 }}),
                        health: new RoleHealthModel({ state: { origin: 5 }}),
                        feats: new RoleFeatsModel({
                            child: {
                                taunt: new TauntModel()
                            }
                        })
                    }
                }),
                feats: new MinionFeatsModel({
                    child: {
                        deathrattle: [new CairneBloodhoofDeathrattleModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
