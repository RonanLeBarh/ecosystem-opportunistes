import { describe, test, expect, beforeEach } from 'vitest'
import { Simulation } from '../src/simulation/loop.js'
import { World } from '../src/engine/world.js'
import { Logger } from '../src/logging/logger.js'

describe('Statistics', () => {
  let simulation
  let world
  let logger

  beforeEach(() => {
    world = new World(10, 10)
    logger = new Logger()
    simulation = new Simulation(world, logger)
  })

  test('updateStats - calculs de base', () => {
    // Ajout de quelques créatures
    simulation.creatures = [
      { age: 10, genes: { carnivore: 0.8, speed: 2, vision: 3, metabolism: 0.5, fertility: 0.6, mutationRate: 0.1 }, traits: { color_r: 255, color_g: 0, color_b: 0 } },
      { age: 20, genes: { carnivore: 0.2, speed: 3, vision: 4, metabolism: 0.6, fertility: 0.7, mutationRate: 0.2 }, traits: { color_r: 0, color_g: 255, color_b: 0 } },
      { age: 30, genes: { carnivore: 0.5, speed: 4, vision: 5, metabolism: 0.7, fertility: 0.8, mutationRate: 0.3 }, traits: { color_r: 0, color_g: 0, color_b: 255 } }
    ]
    
    simulation.updateStats()
    
    expect(simulation.creatures.length).toBe(3)
    expect(simulation.stats.averageAge).toBeCloseTo(20, 1)
    expect(simulation.stats.avgCarnivore).toBeCloseTo(0.5, 2)
  })

  test('updateStats - moyennes génétiques', () => {
    simulation.creatures = [
      { 
        genes: { speed: 2, vision: 3, metabolism: 0.5, fertility: 0.6, mutationRate: 0.1 }, 
        traits: { max_age: 200, color_r: 255, color_g: 0, color_b: 0 }
      },
      { 
        genes: { speed: 4, vision: 5, metabolism: 0.7, fertility: 0.8, mutationRate: 0.2 }, 
        traits: { max_age: 300, color_r: 0, color_g: 255, color_b: 0 }
      }
    ]
    
    simulation.updateStats()
    
    expect(simulation.stats.avgSpeed).toBeCloseTo(3, 1)
    expect(simulation.stats.avgVision).toBeCloseTo(4, 1)
    expect(simulation.stats.avgMetabolism).toBeCloseTo(0.6, 2)
    expect(simulation.stats.avgFertility).toBeCloseTo(0.7, 2)
    expect(simulation.stats.avgMutation).toBeCloseTo(0.15, 3)
  })

  test('updateStats - classification par type', () => {
    simulation.creatures = [
      { genes: { carnivore: 0.8 }, traits: {} }, // carnivore
      { genes: { carnivore: 0.2 }, traits: {} }, // herbivore
      { genes: { carnivore: 0.5 }, traits: {} }  // omnivore
    ]
    
    simulation.updateStats()
    
    expect(simulation.stats.carnivores).toBe(1)
    expect(simulation.stats.herbivores).toBe(1)
    expect(simulation.stats.omnivores).toBe(1)
  })

  test('updateStats - couleurs moyennes', () => {
    simulation.creatures = [
      { traits: { color_r: 255, color_g: 0, color_b: 0 }, genes: {} }, // rouge
      { traits: { color_r: 0, color_g: 255, color_b: 0 }, genes: {} }   // vert
    ]
    
    simulation.updateStats()
    
    expect(simulation.stats.avgColor.r).toBeCloseTo(127.5, 1)
    expect(simulation.stats.avgColor.g).toBeCloseTo(127.5, 1)
    expect(simulation.stats.avgColor.b).toBeCloseTo(0, 1)
  })

  test('updateStats - statistiques de morts', () => {
    simulation.stats.deathEnergy = 10
    simulation.stats.deathAge = 5
    simulation.stats.deathsByAttack = 3
    
    simulation.updateStats()
    
    expect(simulation.stats.deathEnergyPercent).toBeCloseTo(55.6, 1)
    expect(simulation.stats.deathAgePercent).toBeCloseTo(27.8, 1)
    expect(simulation.stats.deathsByAttackPercent).toBeCloseTo(16.7, 1)
  })

  test('updateStats - morts détaillées par type', () => {
    simulation.stats.deathCarnivoreHunger = 5
    simulation.stats.deathHerbivoreHunger = 3
    simulation.stats.deathOmnivoreHunger = 2
    
    simulation.updateStats()
    
    const totalEnergyDeaths = 5 + 3 + 2
    expect(simulation.stats.deathCarnivoreHungerPercent).toBeCloseTo((5 / totalEnergyDeaths) * 100, 1)
    expect(simulation.stats.deathHerbivoreHungerPercent).toBeCloseTo((3 / totalEnergyDeaths) * 100, 1)
    expect(simulation.stats.deathOmnivoreHungerPercent).toBeCloseTo((2 / totalEnergyDeaths) * 100, 1)
  })

  test('updateStats - morts par attaques détaillées', () => {
    simulation.stats.deathByAttackByType = {
      carnivore: 4,
      herbivore: 3,
      omnivore: 2
    }
    
    simulation.updateStats()
    
    const totalAttackDeaths = 4 + 3 + 2
    expect(simulation.stats.deathByAttackByTypePercent.carnivore).toBeCloseTo((4 / totalAttackDeaths) * 100, 1)
    expect(simulation.stats.deathByAttackByTypePercent.herbivore).toBeCloseTo((3 / totalAttackDeaths) * 100, 1)
    expect(simulation.stats.deathByAttackByTypePercent.omnivore).toBeCloseTo((2 / totalAttackDeaths) * 100, 1)
  })

  test('updateStats - aucune créature', () => {
    simulation.creatures = []
    
    simulation.updateStats()
    
    expect(simulation.creatures.length).toBe(0)
    expect(simulation.stats.averageAge).toBe(0)
    expect(simulation.stats.avgCarnivore).toBe(0)
  })

  test('updateStats - pourcentages = 100% pour morts totales', () => {
    simulation.stats.deathEnergy = 10
    simulation.stats.deathAge = 5
    simulation.stats.deathsByAttack = 3
    
    simulation.updateStats()
    
    const totalPercent = simulation.stats.deathEnergyPercent + 
                        simulation.stats.deathAgePercent + 
                        simulation.stats.deathsByAttackPercent
    
    expect(totalPercent).toBeCloseTo(100, 1)
  })
})
