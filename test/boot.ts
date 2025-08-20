import { AppModel, GameModel } from "hearthstone-core";
import { DebugUtil, LogLevel, RouteUtil } from "set-piece";

export function boot(game: GameModel) {
    const app = new AppModel({});
    RouteUtil.boot(app);
    app.set(game);
    game.child.turn.next();
    return game;
}