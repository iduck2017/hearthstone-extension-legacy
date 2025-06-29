import { GameModel, RootModel } from "hearthstone-core";
import { DebugService, LogLevel, RouteAgent } from "set-piece";

export function boot(game: GameModel) {
    DebugService.level = LogLevel.ERROR;
    const root = new RootModel({});
    RouteAgent.boot(root);
    root.start(game);
    return root;
}