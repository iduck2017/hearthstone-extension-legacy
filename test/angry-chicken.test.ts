import { RouteAgent } from "set-piece";
import { AngryBirdCardModel } from "../src/angry-bird/card";
import { GameModel, PlayerModel, MageHeroModel, BoardModel, RootModel } from "hearthstone-core";
import { boot } from "./boot";

describe('angry-chicken', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageHeroModel({}),
                    board: new BoardModel({
                        child: { cards: [new AngryBirdCardModel({})] }
                    })
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageHeroModel({}),
                    board: new BoardModel({
                        child: { cards: [new AngryBirdCardModel({})] }
                    })
                }
            })
        }
    })
    const root = boot(game);

    test('attack', async () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof AngryBirdCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof AngryBirdCardModel);
        expect(cardA).toBeDefined();
        expect(cardB).toBeDefined();
        if (!cardA || !cardB) return;
        
        const roleA = cardA.child.role;
        const roleB = cardB.child.role;
        
        // Initial state: both Angry Birds are at full health (1/1)
        // When at full health, they don't have the +5 attack buff
        let state = {
            attack: 1,
            health: 1,
            modAttack: 0,      // No attack buff when at full health
            modHealth: 0,
            maxHealth: 1,
            curHealth: 1,      // Full health
            curAttack: 1,      // Base attack only
            damage: 0,
        }
        
        expect(roleA.state).toMatchObject(state);
        expect(roleB.state).toMatchObject(state);
        
        // First attack: both birds attack each other
        // They will deal 1 damage to each other (base attack)
        roleA.attack(roleB);
        
        // After first attack: both birds are damaged (0/1)
        // When damaged, they get +5 attack buff
        state = {
            attack: 1,
            health: 1,
            modAttack: 5,      // +5 attack buff when damaged
            modHealth: 0,
            maxHealth: 1,
            curHealth: 0,      // Damaged (0/1)
            curAttack: 6,      // Base attack (1) + buff (5) = 6
            damage: 1,         // Damage taken
        }
        expect(roleA.state).toMatchObject(state);
        expect(roleB.state).toMatchObject(state);
    })
})
