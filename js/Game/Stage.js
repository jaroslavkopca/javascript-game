export default class Stage {
    constructor(level, npcCount, npcHealth,npcSpeed, npcDamage,npcRange, npcTexture, npcSize) {
        this.level = level; // Stage level
        this.npcCount = npcCount; // Number of NPCs to spawn in this stage
        this.npcHealth = npcHealth; // NPC health in this stage
        this.npcSpeed = npcSpeed;
        this.npcDamage = npcDamage; // NPC damage in this stage
        this.npcRange = npcRange;
        this.npcTexture = npcTexture;
        this.npcSize = npcSize
    }
}