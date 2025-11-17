import { ClassType, CostModel, LibraryUtil, RarityType, MinionCardModel, MinionFeaturesModel, RoleAttackModel, RoleHealthModel, TauntModel, DivineShieldModel, DeathrattleModel } from "hearthstone-core";
import { TirionFordringDeathrattleModel } from "./deathrattle";

@LibraryUtil.is('tirion-fordring')
export class TirionFordringModel extends MinionCardModel {
    constructor(props?: TirionFordringModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Tirion Fordring",
                desc: "Divine Shield, Taunt Deathrattle: Equip a 5/3 Ashbringer.",
                flavorDesc: "If you haven't heard the Tirion Fordring theme song, it's because it doesn't exist.",
                isCollectible: true,
                rarity: RarityType.LEGENDARY,
                class: ClassType.PALADIN,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 8 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 8 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 8 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: {
                        divineShield: new DivineShieldModel({ state: { isActive: true } }),
                        taunt: new TauntModel({ state: { isActive: true } }),
                        deathrattle: [new TirionFordringDeathrattleModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

