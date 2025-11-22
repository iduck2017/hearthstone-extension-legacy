import { MinionCardModel, RarityType, ClassType, RoleAttackModel, RoleHealthModel, CostModel, LibraryUtil } from "hearthstone-core";
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
                collectible: true,
                ...props.state
            },
            child: {
                cost: props.child?.cost ??  new CostModel({ state: { origin: 6 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 5 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 4 }}),
                battlecry: props.child?.battlecry ?? [new PriestessOfEluneBattlecryModel()],
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}
