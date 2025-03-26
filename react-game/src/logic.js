export function collides(a, b) {
    return (
      a.x < b.x + b.size &&
      a.x + a.size > b.x &&
      a.y < b.y + b.size &&
      a.y + a.size > b.y
    );
  }
  
  export function checkCoinCollision(player, coins) {
    const newCoins = [];
    let collected = false;
    for (const coin of coins) {
      if (collides(player, coin)) {
        collected = true;
      } else {
        newCoins.push(coin);
      }
    }
    return {
      updatedCoins: newCoins,
      scoreDelta: collected ? 1 : 0,
    };
  }
  
  export function checkEnemyCollision(player, enemies) {
    for (const enemy of enemies) {
      if (collides(player, enemy)) return true;
    }
    return false;
  }
  
  export function incrementSurvivalTime(state) {
    return {
      ...state,
      survivalTime: state.survivalTime + 1,
    };
  }
  