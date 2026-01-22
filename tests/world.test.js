import { describe, test, expect, beforeEach } from 'vitest'
import { World } from '../src/engine/world.js'
import { Creature } from '../src/creatures/creature.js'
import { Traits } from '../src/creatures/traits.js'

describe('World', () => {
  let world

  beforeEach(() => {
    world = new World(10, 10)
  })

  test('initialisation - dimensions correctes', () => {
    expect(world.width).toBe(10)
    expect(world.height).toBe(10)
    expect(world.grid).toHaveLength(10)
    expect(world.grid[0]).toHaveLength(10)
  })

  test('isInside - limites respectées', () => {
    expect(world.isInside(0, 0)).toBe(true)
    expect(world.isInside(9, 9)).toBe(true)
    expect(world.isInside(5, 5)).toBe(true)
    
    expect(world.isInside(-1, 0)).toBe(false)
    expect(world.isInside(0, -1)).toBe(false)
    expect(world.isInside(10, 0)).toBe(false)
    expect(world.isInside(0, 10)).toBe(false)
  })

  test('getCell - retourne case correcte', () => {
    const cell = world.getCell(5, 5)
    expect(cell).toBeDefined()
    expect(cell).toHaveProperty('resource')
    expect(cell).toHaveProperty('obstacle')
    expect(cell).toHaveProperty('creature')
  })

  test('getCell - hors limites', () => {
    const cell = world.getCell(-1, -1)
    expect(cell).toBeNull()
  })

  test('moveCreature - déplacement valide', () => {
    const creature = new Creature(5, 5, Traits.random())
    const fromCell = world.getCell(5, 5)
    const toCell = world.getCell(6, 5)
    
    fromCell.creature = creature
    
    const result = world.moveCreature(5, 5, 6, 5)
    
    expect(result).toBe(true)
    expect(fromCell.creature).toBeNull()
    expect(toCell.creature).toBe(creature)
    expect(creature.x).toBe(6)
    expect(creature.y).toBe(5)
  })

  test('moveCreature - case occupée', () => {
    const creature1 = new Creature(5, 5, Traits.random())
    const creature2 = new Creature(6, 5, Traits.random())
    const fromCell = world.getCell(5, 5)
    const toCell = world.getCell(6, 5)
    
    fromCell.creature = creature1
    toCell.creature = creature2
    
    const result = world.moveCreature(5, 5, 6, 5)
    
    expect(result).toBe(false)
    expect(fromCell.creature).toBe(creature1)
    expect(toCell.creature).toBe(creature2)
  })

  test('moveCreature - hors limites', () => {
    const creature = new Creature(0, 0, Traits.random())
    const fromCell = world.getCell(0, 0)
    fromCell.creature = creature
    
    const result = world.moveCreature(0, 0, -1, 0)
    
    expect(result).toBe(false)
    expect(fromCell.creature).toBe(creature)
  })

  test('addResource - ajout réussi', () => {
    const result = world.addResource(5, 5)
    
    expect(result).toBe(true)
    const cell = world.getCell(5, 5)
    expect(cell.resource).toBe(true)
  })

  test('addResource - case occupée', () => {
    const creature = new Creature(5, 5, Traits.random())
    const cell = world.getCell(5, 5)
    cell.creature = creature
    
    const result = world.addResource(5, 5)
    
    expect(result).toBe(false)
    expect(cell.resource).toBe(false)
  })

  test('removeResource - suppression réussie', () => {
    world.addResource(5, 5)
    const result = world.removeResource(5, 5)
    
    expect(result).toBe(true)
    const cell = world.getCell(5, 5)
    expect(cell.resource).toBe(false)
  })

  test('removeResource - pas de ressource', () => {
    const result = world.removeResource(5, 5)
    
    expect(result).toBe(false)
  })
})
