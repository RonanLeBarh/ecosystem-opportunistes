import { describe, test, expect, beforeEach } from 'vitest'
import { Creature } from '../src/creatures/creature.js'
import { Traits } from '../src/creatures/traits.js'
import { World } from '../src/engine/world.js'

describe('Creature', () => {
  let world
  let creature

  beforeEach(() => {
    world = new World(10, 10)
    world.simulation = {
      creatures: [],
      cycle: 1,
      logger: { log: () => {} }
    }
    const traits = Traits.random()
    creature = new Creature(5, 5, traits)
  })

  test('initialisation - position et traits', () => {
    expect(creature.x).toBe(5)
    expect(creature.y).toBe(5)
    expect(creature.traits).toBeDefined()
    expect(creature.genes).toBeDefined()
    expect(creature.energy).toBeGreaterThan(0)
    expect(creature.age).toBe(0)
    expect(creature.dead).toBe(false)
  })

  test('update - mort par énergie = 0', () => {
    creature.energy = 0
    creature.update(world)
    
    expect(creature.dead).toBe(true)
  })

  test('update - mort par âge max', () => {
    creature.age = creature.traits.max_age
    creature.update(world)
    
    expect(creature.dead).toBe(true)
  })

  test('update - pas de mort si conditions OK', () => {
    creature.energy = 50
    creature.age = 10
    creature.update(world)
    
    expect(creature.dead).toBe(false)
  })

  test('update - vieillissement', () => {
    const initialAge = creature.age
    creature.update(world)
    
    expect(creature.age).toBe(initialAge + 1)
  })

  test('moveTowards - déplacement vers cible', () => {
    const target = { x: 7, y: 7 }
    const initialX = creature.x
    const initialY = creature.y
    
    creature.moveTowards(target, world)
    
    expect(creature.x).not.toBe(initialX)
    expect(creature.y).not.toBe(initialY)
  })

  test('moveTowards - cible atteinte', () => {
    const target = { x: 6, y: 5 } // juste à côté
    creature.moveTowards(target, world)
    
    expect(creature.x).toBe(6)
    expect(creature.y).toBe(5)
  })

  test('moveRandom - déplacement aléatoire', () => {
    const initialX = creature.x
    const initialY = creature.y
    
    creature.moveRandom(world)
    
    // Le déplacement doit être d'une case maximum
    expect(Math.abs(creature.x - initialX)).toBeLessThanOrEqual(1)
    expect(Math.abs(creature.y - initialY)).toBeLessThanOrEqual(1)
  })

  test('eat - consommation de ressource', () => {
    const cell = world.getCell(creature.x, creature.y)
    cell.resource = true
    const initialEnergy = creature.energy
    
    creature.eat(world)
    
    expect(cell.resource).toBe(false)
    expect(creature.energy).toBeGreaterThan(initialEnergy)
  })

  test('eat - pas de ressource', () => {
    const initialEnergy = creature.energy
    
    creature.eat(world)
    
    expect(creature.energy).toBe(initialEnergy)
  })

  test('die - marquée comme morte', () => {
    creature.die(world)
    
    expect(creature.dead).toBe(true)
  })

  test('gènes - valeurs dans les bornes', () => {
    expect(creature.genes.speed).toBeGreaterThanOrEqual(1)
    expect(creature.genes.speed).toBeLessThanOrEqual(5)
    expect(creature.genes.vision).toBeGreaterThanOrEqual(1)
    expect(creature.genes.vision).toBeLessThanOrEqual(10)
    expect(creature.genes.metabolism).toBeGreaterThanOrEqual(0.2)
    expect(creature.genes.metabolism).toBeLessThanOrEqual(3)
    expect(creature.genes.fertility).toBeGreaterThanOrEqual(0.1)
    expect(creature.genes.fertility).toBeLessThanOrEqual(1)
    expect(creature.genes.carnivore).toBeGreaterThanOrEqual(0)
    expect(creature.genes.carnivore).toBeLessThanOrEqual(1)
  })

  test('traits - couleurs valides', () => {
    expect(creature.traits.color_r).toBeGreaterThanOrEqual(0)
    expect(creature.traits.color_r).toBeLessThanOrEqual(255)
    expect(creature.traits.color_g).toBeGreaterThanOrEqual(0)
    expect(creature.traits.color_g).toBeLessThanOrEqual(255)
    expect(creature.traits.color_b).toBeGreaterThanOrEqual(0)
    expect(creature.traits.color_b).toBeLessThanOrEqual(255)
  })
})
