import { ClassType, CostModel, LibraryService, RarityType, MinionCardModel, MinionFeaturesModel, RoleAttackModel, RoleHealthModel, TauntModel, MinionBattlecryModel } from "hearthstone-core";
import { GuardianOfKingsBattlecryModel } from "./battlecry";

@LibraryService.is('guardian-of-kings')
export class GuardianOfKingsModel extends MinionCardModel {
    constructor(props?: GuardianOfKingsModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Guardian of Kings",
                desc: "Taunt Battlecry: Restore 6 Health to your hero.",
                flavorDesc: "Holy beings from the beyond are so cliché!",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PALADIN,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 7 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 5 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 7 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: {
                        taunt: new TauntModel({ state: { isActive: true } }),
                        battlecry: [new GuardianOfKingsBattlecryModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

