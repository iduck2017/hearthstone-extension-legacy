/**
 * Test cases for Upgrade!
 * 
 * - initial-state:
 *   - Player A has Upgrade! in hand
 *   - Player A hero has no weapon
 *   - Player B has Upgrade! in hand
 *   - Player B hero has Fiery War Axe equipped
 * - upgrade-cast:
 *   - Player A casts Upgrade!
 *   - Assert: Player A hero has a 1/3 weapon equipped
 * - turn-next:
 *   - Turn switches to Player B
 * - upgrade-cast:
 *   - Player B casts Upgrade!
 *   - Assert: Fiery War Axe attack becomes 4
 *   - Assert: Fiery War Axe durability becomes 3
 */
import { BoardModel, GameModel, HandModel, MageModel, ManaModel, PlayerModel, WarriorModel, DeckModel } from "hearthstone-core";
import { UpgradeModel } from ".";
import { FieryWarAxeModel } from "../fiery-war-axe";
import { boot } from "../../boot";

describe('upgrade', () => {
    // TODO: 根据测试场景设计生成测试用例
})

