import { GameModel, PlayerModel, HandModel, BoardModel, MageModel } from "hearthstone-core";
import { WispCardModel } from "../src/wisp";   
import { boot } from "./boot";
import { DebugUtil, LogLevel } from "set-piece";
import { ShieldbearerCardModel } from "../src";

DebugUtil.level = LogLevel.ERROR;
describe('wisp', () => {
    const game = new GameModel({
        child: {
            playerA: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    hand: new HandModel({
                        child: { cards: [new WispCardModel({})] }
                    }),
                }
            }),
            playerB: new PlayerModel({
                child: {
                    hero: new MageModel({}),
                    board: new BoardModel({
                        child: { cards: [
                            new WispCardModel({}),
                            new ShieldbearerCardModel({})
                        ]}
                    })
                }
            })
        }
    })
    boot(game);


    test('attack', async () => {

    })

})