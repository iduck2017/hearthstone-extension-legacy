import { ClassType, CostModel, LibraryUtil, RarityType, MinionCardModel, MinionFeaturesModel, RoleAttackModel, RoleHealthModel, MinionBattlecryModel } from "hearthstone-core";
import { AldorPeacekeeperBattlecryModel } from "./battlecry";

@LibraryUtil.is('aldor-peacekeeper')
export class AldorPeacekeeperModel extends MinionCardModel {
    constructor(props?: AldorPeacekeeperModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "Aldor Peacekeeper",
                desc: "Battlecry: Change an enemy minion's Attack to 1.",
                flavorDesc: "The Aldor hate two things: the Scryers and smooth jazz.",
                isCollectible: true,
                rarity: RarityType.RARE,
                class: ClassType.PALADIN,
                races: [],
                ...props.state
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 3 }}),
                attack: props.child?.attack ?? new RoleAttackModel({ state: { origin: 3 }}),
                health: props.child?.health ?? new RoleHealthModel({ state: { origin: 3 }}),
                feats: props.child?.feats ?? new MinionFeaturesModel({
                    child: {
                        battlecry: [new AldorPeacekeeperBattlecryModel()]
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer }
        });
    }
}

