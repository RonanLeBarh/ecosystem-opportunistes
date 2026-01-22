import { describe, test, expect, beforeEach } from 'vitest'
import { Creature } from '../src/creatures/creature.js'
import { Traits } from '../src/creatures/traits.js'
import { Reproduction } from '../src/creatures/reproduction.js'
import { World } from '../src/engine/world.js'
import { CONFIG } from '../src/simulation/config.js'

// Mock du monde pour les tests
class MockWorld {
  constructor() {
    this.width = 10
    this.height = 10
    this.grid = Array(this.height).fill().map(() => Array(this.width).fill(null))
    this.simulation = {
      creatures: [],
      cycle: 1,
      logger: {
        log: () => {}
      }
    }
  }

  getCell(x, y) {
    if (!this.isInside(x, y)) return null
    return this.grid[y][x] || { resource: false, obstacle: false, creature: null }
  }

  isInside(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height
  }

  moveCreature(fromX, fromY, toX, toY) {
    if (!this.isInside(toX, toY)) return false
    const fromCell = this.getCell(fromX, fromY)
    const toCell = this.getCell(toX, toY)
    if (toCell.creature) return false
    
    toCell.creature = fromCell.creature
    fromCell.creature = null
    return true
  }
}

describe('Reproduction', () => {
  let world
  let parent

  beforeEach(() => {
    world = new MockWorld()
    const traits = Traits.random()
    parent = new Creature(0, 0, traits) // Position (0,0) pour éviter les conflits
    parent.energy = 100
    
    // Place le parent dans la grille du MockWorld
    const parentCell = world.getCell(0, 0)
    parentCell.creature = parent
  })

  test('canReproduce - énergie suffisante', () => {
    CONFIG.REPRODUCTION_ENERGY_THRESHOLD = 50
    parent.energy = 60
    
    expect(Reproduction.canReproduce(parent)).toBe(true)
  })

  test('canReproduce - énergie insuffisante', () => {
    CONFIG.REPRODUCTION_ENERGY_THRESHOLD = 50
    parent.energy = 30
    
    expect(Reproduction.canReproduce(parent)).toBe(false)
  })

  test('createOffspring - création réussie', () => {
    CONFIG.REPRODUCTION_ENERGY_COST = 20
    CONFIG.REPRODUCTION_ENERGY_THRESHOLD = 50
    parent.energy = 60
    
    const child = Reproduction.createOffspring(parent, world)
    
    expect(child).toBeDefined()
    expect(child).toBeInstanceOf(Creature)
    expect(child.x).toBe(1) // à droite du parent (0,0 -> 1,0)
    expect(child.y).toBe(0)
    expect(world.simulation.creatures).toContain(child)
  })

  test('createOffspring - coût énergétique déduit', () => {
    CONFIG.REPRODUCTION_ENERGY_COST = 20
    CONFIG.REPRODUCTION_ENERGY_THRESHOLD = 50
    parent.energy = 60
    
    Reproduction.createOffspring(parent, world)
    
    expect(parent.energy).toBe(40) // 60 - 20
  })

  test('createOffspring - pas de place disponible (alternative)', () => {
    // Utilise un vrai World avec une grille 1x1
    const realWorld = new World(1, 1)
    realWorld.simulation = {
      creatures: [],
      cycle: 1,
      logger: { log: () => {} }
    }
    
    // Place le parent au centre (0,0)
    const parentCell = realWorld.getCell(0, 0)
    parentCell.creature = parent
    parent.x = 0
    parent.y = 0
    
    const child = Reproduction.createOffspring(parent, realWorld)
    
    expect(child).toBeNull() // Aucune place disponible dans une grille 1x1
    expect(parent.energy).toBe(100) // pas de coût si échec
  })

  test('mutateGene - mutation appliquée', () => {
    const originalValue = 5
    const rate = 1 // 100% de chance de muter
    const min = 1
    const max = 10
    
    const mutated = Reproduction.mutateGene(originalValue, rate, min, max)
    
    expect(mutated).not.toBe(originalValue)
    expect(mutated).toBeGreaterThanOrEqual(min)
    expect(mutated).toBeLessThanOrEqual(max)
  })

  test('mutateGene - pas de mutation', () => {
    const originalValue = 5
    const rate = 0 // 0% de chance de muter
    const min = 1
    const max = 10
    
    const mutated = Reproduction.mutateGene(originalValue, rate, min, max)
    
    expect(mutated).toBe(originalValue)
  })
})
