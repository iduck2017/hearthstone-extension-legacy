# 任务

你是一个卡牌游戏的开发者，你的任务是根据index.json中的卡牌信息，生成具体的代码和测试用例

# 规则

你应当严格遵循游戏规则：

- 英雄的初始生命值是30，攻击力为0

- 双方玩家轮流行动，玩家只能在自己所在的回合执行动作

- 角色每回合通常只有一次行动次数

# 步骤

### 生成卡牌逻辑

请严格按照以下步骤执行

- 从index.json中挑选一份尚未实现的配置，优先选择卡牌描述简单的。
- 阅读卡牌描述，从项目中找到类似卡牌的实现方式，告诉我可以参考哪些卡牌

```

例如：Demolisher: At the start of your turn, deal 2 damage to a random enemy.
你应当先了解 start turn，deal damage 的实现方式

```

- 参考类似实现，生成卡牌功能代码，对于首次出现的机制，不要自行猜测，预留@TODO的注释逻辑，并提醒我补全代码。

- 你需要遵循如下规范



### 设计测试场景

- 创建测试用例文件，但先不要生成测试用例，而是查看类似卡牌的测试用例，设计一个测试场景和我讨论

```

例如：Demolisher: At the start of your turn, deal 2 damage to a random enemy.

你的测试用例需要体现如下特点：start turn, deal damage

你应当创建如下测试场景

- initial-state：
    - playerB 手牌中有 Demolisher
    - playerA 场上没有随从
    - 回合开始
- turn-next：
    - assert：playerA 生命值为30
    - 回合轮转，playerB的回合
    - assert：playerA 生命值为30（Demolisher还在playerB的手牌中）
- demolisher-play
    - playerB打出demolisher
    - 回合轮转，playerA的回合
    - assert：playerA 生命值为30（Demolisher只会在playerB的回合开始生效）
    - 回合轮转，playerB的回合
    - assert：playerA 生命值为28（Demolisher触发，造成2点伤害）

```

- 各测试用例是顺序执行的，并不独立，推演并确认逻辑的合理性

- 每次更新，将测试场景翻译成英文，作为注释放在测试用例文件顶部

- 我会和你进行一系列会话，直到生成令我满意的测试场景

### 生成测试用例

- 在得到我认可后，你才根据测试场景生成测试用例

- 你需要遵循如下规范：

    - 只保留关键的断言，不要对细节做过度的检查

    - 除了initial-state外，一个列表项对应一个测试函数
    
    - 用例名应当是严格的`名词-动词` 组合，例如 `fireball-cast`,`wisp-attack`

    - 卡牌从`cardC`开始命名，玩家用`playerA`和`playerB`表示
    
- 为测试用例添加注释，每个断言语句前都应当注释，保留顶部注释

- 运行测试用例,确保正确执行