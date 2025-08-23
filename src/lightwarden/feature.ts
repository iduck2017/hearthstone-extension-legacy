import { FeatureModel } from "hearthstone-core";

export namespace LightwardenFeatureModel {
    export type Event = {};
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export class LightwardenFeatureModel extends FeatureModel<
    LightwardenFeatureModel.Event,
    LightwardenFeatureModel.State,
    LightwardenFeatureModel.Child,
    LightwardenFeatureModel.Refer
> {
    constructor(props: LightwardenFeatureModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Lightwarden\'s Feature',
                desc: 'At the end of your turn, give a random friendly minion +1/+1.',
                status: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

}