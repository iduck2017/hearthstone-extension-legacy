import { GameModel, RootModel } from "hearthstone-core";
import { DebugUtil, LogLevel, RouteUtil } from "set-piece";

export function boot(game: GameModel) {
    DebugUtil.level = LogLevel.ERROR;
    const root = new RootModel({});
    RouteUtil.boot(root);
    root.start(game);
    return root;
}