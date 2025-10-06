/*
 * Azure Drake
 * They initially planned to be the Beryl or Cerulean drakes, but those felt a tad too pretentious.
 *
 * Spell Damage +1 Battlecry: Draw a card.
 *
 * Type: Minion
 * Minion Type: Dragon
 * Rarity: Rare
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 100 / 800 (Golden)
 * Disenchanting Yield: 20 / 100 (Golden)
 * Artist: Ben Zhang
 * Collectible
 */
import { MinionCardModel, RoleHealthModel, RoleAttackModel, RoleModel, ClassType, RarityType, RaceType, MinionHooksModel, LibraryUtil, CostModel, SpellBuffModel } from "hearthstone-core";
import { AzureDrakeBattlecryModel } from "./battlecry";
import { Loader } from "set-piece";

@LibraryUtil.is('azure-drake')
export class AzureDrakeModel extends MinionCardModel {
    constructor(loader?: Loader<AzureDrakeModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Azure Drake',
                    desc: 'Spell Damage +1 Battlecry: Draw a card.',
                    isCollectible: true,
                    flavorDesc: 'They initially planned to be the Beryl or Cerulean drakes, but those felt a tad too pretentious.',
                    rarity: RarityType.RARE,
                    class: ClassType.NEUTRAL,
                    races: [RaceType.DRAGON],
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 5 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 4 }})),
                            health: new RoleHealthModel(() => ({ state: { origin: 4 }})),
                        }
                    })),
                    feats: new MinionHooksModel(() => ({
                        child: {
                            battlecry: [new AzureDrakeBattlecryModel()],
                            items: [new SpellBuffModel(() => ({ state: { offset: 1 }}))]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
} 