/**
 * Test cases for Commanding Shout
 * 
 * 1. initial-state:
 *    - Player A has Wisp (1/1) on board
 *    - Player A has Commanding Shout in hand
 *    - Player A deck has 1 card
 * 2. commanding-shout-cast:
 *    - Player A uses Commanding Shout
 *    - Assert: Player A's hand size is 1 (Commanding Shout consumed, 1 card drawn)
 * 3. minion-damage:
 *    - Player A uses Fireball on Player A's Wisp (deal 6 damage)
 *    - Assert: Wisp health is 1 (protected from being reduced below 1)
 * 4. turn-end:
 *    - Turn switches to Player B, then back to Player A
 *    - Assert: Protection effect is disabled
 * 5. minion-damage-again:
 *    - Player A uses Fireball on Player A's Wisp again (deal 6 damage)
 *    - Assert: Wisp is destroyed (protection effect expired)
 */

