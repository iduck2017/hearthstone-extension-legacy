/**
 * Kirin Tor Mage 3/4/3
 * The Kirin Tor reside in the floating city of Dalaran. How do you make a Dalaran float? Two scoops of ice cream, one scoop of Dalaran.
 * 
 * Battlecry: The next Secret you play this turn costs (0).
 * 
 * Type: Minion
 * Rarity: Rare
 * Set: Legacy
 * Class: Mage
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Popo Wei
 * Collectible
 */
import { ClassType, CostModel, RoleHealthModel, LibraryUtil, MinionCardModel, MinionHooksModel, RarityType, RoleAttackModel, RoleModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { KirinTorMageBattlecryModel } from "./battlecry";

@LibraryUtil.is('kirin-tor-mage')
export class KirinTorMageModel extends MinionCardModel {
    constructor(loader?: Loader<KirinTorMageModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Kirin Tor Mage',
                    desc: 'Battlecry: The next Secret you play this turn costs (0).',
                    flavorDesc: 'The Kirin Tor reside in the floating city of Dalaran. How do you make a Dalaran float? Two scoops of ice cream, one scoop of Dalaran.',
                    isCollectible: true,
                    rarity: RarityType.RARE,
                    class: ClassType.MAGE,
                    races: [],
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 3 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 4 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 3 }})),
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: { battlecry: [new KirinTorMageBattlecryModel()] }
                    })),
                    ...props.child,
                },
                refer: { ...props.refer },
            };
        });
    }
}
