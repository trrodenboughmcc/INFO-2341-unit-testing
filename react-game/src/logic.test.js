import {
    collides,
    checkCoinCollision,
    checkEnemyCollision,
    incrementSurvivalTime
  } from './logic.js';
  
  import { describe, it, expect } from 'vitest';
  
  //
  // --- collides() ---
  //
  describe('collides', () => {
    it('returns true for overlapping boxes', () => {
      const a = { x: 0, y: 0, size: 10 };
      const b = { x: 5, y: 5, size: 10 };
      expect(collides(a, b)).toBe(true);
    });
  
    it('returns false when objects do not overlap', () => {
      const a = { x: 0, y: 0, size: 10 };
      const b = { x: 100, y: 100, size: 10 };
      expect(collides(a, b)).toBe(false);
    });
  
    it('returns false when objects just touch edges', () => {
      const a = { x: 0, y: 0, size: 10 };
      const b = { x: 10, y: 0, size: 10 };
      expect(collides(a, b)).toBe(false);
    });
  });
  
  //
  // --- checkCoinCollision() ---
  //
  describe('checkCoinCollision', () => {
    it('returns scoreDelta 1 and removes collected coin', () => {
      const player = { x: 0, y: 0, size: 10 };
      const coins = [
        { x: 0, y: 0, size: 10 },
        { x: 100, y: 100, size: 10 }
      ];
  
      const { updatedCoins, scoreDelta } = checkCoinCollision(player, coins);
      expect(scoreDelta).toBe(1);
      expect(updatedCoins.length).toBe(1);
      expect(updatedCoins[0]).toEqual({ x: 100, y: 100, size: 10 });
    });
  
    it('returns scoreDelta 0 if no coin was collected', () => {
      const player = { x: 0, y: 0, size: 10 };
      const coins = [{ x: 50, y: 50, size: 10 }];
      const result = checkCoinCollision(player, coins);
  
      expect(result.scoreDelta).toBe(0);
      expect(result.updatedCoins.length).toBe(1);
    });
  });
  
  //
  // --- checkEnemyCollision() ---
  //
  describe('checkEnemyCollision', () => {
    it('returns true when player overlaps an enemy', () => {
      const player = { x: 0, y: 0, size: 10 };
      const enemies = [{ x: 0, y: 0, size: 10 }];
      expect(checkEnemyCollision(player, enemies)).toBe(true);
    });
  
    it('returns false when no enemies collide', () => {
      const player = { x: 0, y: 0, size: 10 };
      const enemies = [{ x: 100, y: 100, size: 10 }];
      expect(checkEnemyCollision(player, enemies)).toBe(false);
    });
  });
  
  //
  // --- incrementSurvivalTime() ---
  //
  describe('incrementSurvivalTime', () => {
    it('increases survivalTime by 1', () => {
      const state = { survivalTime: 5, isGameOver: false };
      const result = incrementSurvivalTime(state);
      expect(result.survivalTime).toBe(6);
    });

    // write a unit test to make sure that the time stays the same 
    // when the game is over

    // write a unit test to make sure that when the game starts over,
    // the timer is incremented from 0 to 1
  });
  