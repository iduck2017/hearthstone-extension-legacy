import { ClassType, CostModel, LibraryService, RarityType, MinionCardModel, MinionFeaturesModel, RoleAttackModel, RoleHealthModel, MinionBattlecryModel } from "hearthstone-core";
import { ArgentProtectorBattlecryModel } from "./battlecry";

@LibraryService.is('argent-protector')
export class ArgentProtectorModel extends MinionCardModel {
    constructor(props?: ArgentProtectorModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Argent Protector",
                desc: "Battlecry: Give a friendly minion Divine Shield.",
                flavorDesc: "\"I'm not saying you can dodge fireballs. I'm saying with this shield, you won't have to.\"",
                isCollectible: true,
                rarity: RarityType.COMMON,
                class: ClassType.PALADIN,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 3 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 2 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: {
                        battlecry: [new ArgentProtectorBattlecryModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

