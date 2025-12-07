# 任务

SpellEffectModel的api发生了变更,请检查项目下所有涉及SpellEffectModel的代码并修复

- 删除damage属性

- 判断当前效果是否涉及到法术伤害,并检查desc属性
    
    - 如果不涉及,则不继续变更
    
    - 如果涉及,且desc中包含spellDamage占位符,则替换为具体的伤害值,并使用*包裹

    - 如果涉及,且desc中包含具体的伤害值,则用*包裹

- 检查是否存在对DamageModel.deal的使用,移除damage相关的逻辑,直接使用原始值

- 顺便检查一下,DamageEvent.type 应当为 DamageType.SPELL

# 示例

修改前:

```
@ChunkService.is('fireball-effect')
export class FireballEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: FireballEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Fire ball's effect",
                desc: "Deal {{spellDamage[0]}} damage",
                damage: [6],
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    precheck(): Selector<RoleModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.refer.roles;
        return new Selector(roles, { hint: "Choose a target" })
    }

    protected async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const card = this.route.card;
        if (!card) return;
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: this.state.damage[0] ?? 0
            })
        ])
    }
}
```


修改后:

```
@ChunkService.is('fireball-effect')
export class FireballEffectModel extends SpellEffectModel<RoleModel> {
    constructor(props?: FireballEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "Fire ball's effect",
                desc: "Deal *6* damage",
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    precheck(): Selector<RoleModel> | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.refer.roles;
        return new Selector(roles, { hint: "Choose a target" })
    }

    protected async doRun(params: Array<RoleModel | undefined>) {
        const target = params[0];
        if (!target) return;
        const card = this.route.card;
        if (!card) return;
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                method: this,
                target,
                origin: 6
            })
        ])
    }
}
```