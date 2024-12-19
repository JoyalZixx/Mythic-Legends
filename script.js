// Initialize inventory
let inventory = [{name: "sword", quantity: 1}];



// Reference to the message screen
const msgScreen = document.getElementById("msgText");

// Button references
const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
const btn3 = document.getElementById("btn3");
const btn4 = document.getElementById("btn4");

// Initialize default game state
let explore = 0;
let health = 100;
let coin = 0;
const items = ["rock", "stick", "fiber", "apple", "mushroom"];

// Retrieve progress on game start
window.addEventListener("DOMContentLoaded", function () {
  const progress = retrieveProgress();
  health = progress.health;
  coin = progress.coin;
  explore = progress.explore;
  inventory = progress.inventory;

  // Update UI with the saved progress
  document.querySelector('.health-bar .inner').style.width = `${health}%`;
  document.querySelector('.health-bar .text').innerHTML = `${health}`;
  document.querySelector('.coinContainer .coin').innerHTML = `${coin}`;

  if (explore >= 3) {
    btn2.style.display = "block";
    btn3.style.display = "block";
    btn2.innerHTML = "slime field";
    btn3.innerHTML = "heal";
  }

  createInventoryFromItemsArray();
});

// Handle game over scenario
function gameOver() {
  if (health <= 0) {
    saveProgress();
    msgScreen.innerHTML = "<span class='damageMsg'>Game Over</span>";
    document.querySelectorAll('#btn1, #btn2, #btn3, #btn4').forEach(button => button.style.display = "none");

    const btnContainer = document.querySelector('.btncontainer');
    const respawnbtn = document.createElement('button');
    respawnbtn.classList.add('button');
    respawnbtn.id = 'respawnbtn';
    respawnbtn.textContent = 'Respawn';
    btnContainer.appendChild(respawnbtn);

    respawnbtn.disabled = true;
    respawnbtn.style.cursor = "not-allowed";
    setTimeout(() => {
      respawnbtn.disabled = false;
      respawnbtn.style.cursor = "pointer";
    }, 100);

    respawnbtn.addEventListener("click", () => {
      respawnbtn.remove();
      document.querySelectorAll('#btn1, #btn2, #btn3').forEach(button => button.style.display = "block");
      msgScreen.innerHTML = "You woke up feeling hurt, but you are still alive. Keep eating apples.<br><span class='damageMsg'>You lost 10 coins.</span>";
      health = 20;
      coin = Math.max(coin - 10, 0);

      document.querySelector('.health-bar .inner').style.width = `${health}%`;
      document.querySelector('.health-bar .text').innerHTML = `${health}`;
      document.querySelector('.coinContainer .coin').innerHTML = `${coin}`;

      saveProgress();
    });
  }
}

// Add audio click functionality
const click = document.getElementById("click");

function createInventoryFromItemsArray() {
  items.forEach(name => {
    const existingItem = inventory.find(i => i && i.name && i.name.toLowerCase() === name.toLowerCase());
    if (!existingItem) {
      inventory.push({ name, quantity: 0 });
    }
  });
}
// Display inventory
function displayInventory() {
  msgScreen.innerHTML = "Inventory:<br>";
  inventory.forEach(item => {
    if (item.quantity > 0) {
      msgScreen.innerHTML += `${item.name} x${item.quantity}<br>`;
    }
  });
}

// display inventory
document.getElementById("inventoryView").addEventListener("click", () => {
  click.play();
  displayInventory();
});

// reset button
document.getElementById("resetBtn").addEventListener("click", () => {
  localStorage.removeItem("progressData");
  
  health = 100; 
  coin = 0; 
  explore = 0; 
  inventory = [];

  addNewItemToInventory("sword", "1");


  msgScreen.innerHTML = "Progress has been reset. <br> now go explore.";


  document.querySelector('.health-bar .inner').style.width = `${health}%`;
  document.querySelector('.health-bar .text').innerHTML = `${health}`;
  document.querySelector('.coinContainer .coin').innerHTML = `${coin}`;

  createInventoryFromItemsArray();
    // if (explore >= 3) {
    //   btn2.style.display = "block";
    //   btn3.style.display = "block";
    //   btn2.innerHTML = "slime field";
    //   btn3.innerHTML = "heal";
    // }
});
// Increase quantity of an item in inventory
function increaseQuantity(itemName, amount) {
  if (!itemName || amount === undefined) {
    throw new Error("increaseQuantity() requires both itemName and amount to be provided");
  }

  const item = inventory.find(i => i && i.name && i.name.toLowerCase() === itemName.toLowerCase());
  if (!item) {
    throw new Error(`Item with name "${itemName}" not found in inventory`);
  }
  
  item.quantity += amount;
}

function addNewItemToInventory(itemName, quantity) {
  if (!itemName || quantity === undefined) {
    console.error("Item name and quantity must be provided to add a new item.");
    return;
  }

  const existingItem = inventory.find(i => i.name.toLowerCase() === itemName.toLowerCase());
  if (existingItem) {
    console.log(`Item "${itemName}" already exists in the inventory.`);
    return;
  }

  inventory.push({ name: itemName, quantity: Number(quantity) });
  console.log(`Item "${itemName}" has been added to the inventory with quantity ${quantity}.`);
}

// explore button
btn1.innerHTML = "Explore";
btn1.addEventListener("click", () => {
  click.play();
  const ranitem = items[Math.floor(Math.random() * items.length)];
  increaseQuantity(ranitem, 1);
  explore += 1;

  if (explore === 3) {
    btn2.style.display = "block";
    btn3.style.display = "block";
    btn2.innerHTML = "slime field";
    btn3.innerHTML = "heal";
  }

  msgScreen.innerHTML = `You walked through the forest and found a ${ranitem}!`;

  btn1.disabled = true;
  btn1.style.cursor = "not-allowed";
  setTimeout(() => {
    btn1.disabled = false;
    btn1.style.cursor = "pointer";
  }, 100);

  saveProgress();
});

// Button 2 (Slime Field)
btn2.addEventListener("click", () => {
  click.play();
  if (btn2.innerHTML === "slime field") {
    health = Math.max(health - 10, 0);
    coin += 10;
    msgScreen.innerHTML = `You were walking through the slime field and a slime attacked you!<br><span class='damageMsg'>You took 10 damage.</span><br>You swung your sword and hit the slime.<br><em>You killed the slime.</em>`;

    document.querySelector('.health-bar .inner').style.width = `${health}%`;
    document.querySelector('.health-bar .text').innerHTML = `${health}`;
    document.querySelector('.coinContainer .coin').innerHTML = `${coin}`;

    gameOver();
    saveProgress();
  }
});

// Button 3 (Heal)
btn3.addEventListener("click", () => {
  click.play();
  if (btn3.innerHTML === "heal") {
    const apple = inventory.find(i => i.name.toLowerCase() === "apple");
    if (health === 100) {
      msgScreen.innerHTML = `<span class='damageMsg'>You are already at full health.</span>`;
    } else if (apple && apple.quantity > 0) {
      health = Math.min(health + 10, 100);
      apple.quantity -= 1;
      msgScreen.innerHTML = `<em>You healed 10 health.</em>`;
    } else {
      msgScreen.innerHTML = `<span class='damageMsg'>You don't have an apple. Try exploring the forest.</span>`;
    }

    document.querySelector('.health-bar .inner').style.width = `${health}%`;
    document.querySelector('.health-bar .text').innerHTML = `${health}`;
    saveProgress();
  }
});

// Save progress data to local storage
function saveProgress() {
  const progressData = {
    health,
    coin,
    explore,
    inventory,
  };
  localStorage.setItem("progressData", JSON.stringify(progressData));
}

// Retrieve progress data from local storage
function retrieveProgress() {
  const progressData = localStorage.getItem("progressData");
  if (progressData) {
    return JSON.parse(progressData);
  }
  return { health: 100, coin: 0, explore: 0, inventory: [] };
}
