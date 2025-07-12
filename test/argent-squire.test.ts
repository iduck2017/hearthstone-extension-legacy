import { GameModel, PlayerModel, MageHeroModel, BoardModel, RootModel } from "hearthstone-core";
import { RouteUtil } from "set-piece";
import { ArgentSquireCardModel } from "../src/argent-squire";
import { boot } from "./boot";

describe('argent-squire', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageHeroModel({}),
                    board: new BoardModel({
                        child: { cards: [new ArgentSquireCardModel({})] }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageHeroModel({}),
                    board: new BoardModel({
                        child: { cards: [new ArgentSquireCardModel({})] }
                    })
                }
            })
        }
    })
    const root = boot(game);

    test('attack', () => {
        const boardA = game.child.playerA.child.board;
        const boardB = game.child.playerB.child.board;
        const cardA = boardA.child.cards.find(item => item instanceof ArgentSquireCardModel);
        const cardB = boardB.child.cards.find(item => item instanceof ArgentSquireCardModel);
        const roleA = cardA?.child.role;
        const roleB = cardB?.child.role;
        if (!roleA || !roleB) return;
        
        // Initial state: both Argent Squires have Divine Shield
        let state = {
            attack: 1,
            health: 1,
            modAttack: 0,
            modHealth: 0,
            damage: 0,
            maxHealth: 1,
            curHealth: 1,
            curAttack: 1,
            isShield: true,     // Divine Shield active
        }
        expect(roleA.state).toMatchObject(state);
        expect(roleB.state).toMatchObject(state);
        
        // First attack: both squires attack each other
        // Divine Shield blocks the damage, so no health is lost
        roleA.attack(roleB);
        
        // After first attack: Divine Shield is consumed, but no damage taken
        state = {
            ...state,
            isShield: false,    // Divine Shield consumed
            damage: 0,          // No damage taken due to Divine Shield
            curHealth: 1,       // Health remains full
        }
        expect(roleA.state).toMatchObject(state);
        expect(roleB.state).toMatchObject(state);
        
        // Second attack: both squires attack each other again
        // Now without Divine Shield, they take damage
        roleA.attack(roleB);
        
        // After second attack: both squires are damaged
        state = {
            ...state,
            damage: 1,          // Damage taken
            curHealth: 0,       // Health reduced to 0
        }
        expect(roleA.state).toMatchObject(state);
        expect(roleB.state).toMatchObject(state);
    })
})