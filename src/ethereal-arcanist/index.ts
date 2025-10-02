/**
 * Ethereal Arcanist 4/3/3
 * The ethereals are wrapped in cloth to give form to their non-corporeal bodies. Also because it's nice and soft.
 * 
 * If you control a Secret at the end of your turn, gain +2/+2.
 * 
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Mage
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Michael Komarck
 * Collectible
 */
import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionHooksModel, RarityType, RoleAttackModel, RoleModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { EtherealArcanistFeatureModel } from "./end-turn";

@LibraryUtil.is('ethereal-arcanist')
export class EtherealArcanistModel extends MinionCardModel {
    constructor(loader?: Loader<EtherealArcanistModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Ethereal Arcanist',
                    desc: 'If you control a Secret at the end of your turn, gain +2/+2.',
                    flavorDesc: 'The ethereals are wrapped in cloth to give form to their non-corporeal bodies. Also because it\'s nice and soft.',
                    isCollectible: true,
                    rarity: RarityType.RARE,
                    class: ClassType.MAGE,
                    races: [],
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 4 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 3 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 3 }})),
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: { endTurn: [new EtherealArcanistFeatureModel()] }
                    })),
                    ...props.child,
                },
                refer: { ...props.refer },
            };
        });
    }
}
