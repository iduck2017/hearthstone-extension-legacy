import { MinionCardModel, RarityType, ClassType, RoleAttackModel, RoleHealthModel, RoleModel, MinionFeatsModel, CostModel, LibraryUtil } from "hearthstone-core";
import { PriestessOfEluneBattlecryModel } from "./battlecry";

@LibraryUtil.is('priestess-of-elune')
export class PriestessOfEluneModel extends MinionCardModel {
    constructor(props?: PriestessOfEluneModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Priestess of Elune",
                desc: "Battlecry: Restore 4 Health to your hero.",
                flavorDesc: "If she threatens to \"moon\" you, it's not what you think.",
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                isCollectible: true,
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 6 }}),
                role: props.child?.role ?? new RoleModel({
                    child: {
                        attack: new RoleAttackModel({ state: { origin: 5 }}),
                        health: new RoleHealthModel({ state: { origin: 4 }}),
                    }
                }),
                feats: props.child?.feats ?? new MinionFeatsModel({
                    child: {
                        battlecry: [new PriestessOfEluneBattlecryModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
