const msgScreen = document.getElementById("msgText");

const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
const btn3 = document.getElementById("btn3");
const btn4 = document.getElementById("btn4");

// Call retrieveProgress() when the game starts
window.addEventListener("DOMContentLoaded", function() {
  const progress = retrieveProgress();
  health = progress.health;
  coin = progress.coin;
  explore = progress.explore;

  document.querySelector('.health-bar .inner').style.width = `${health}%`;
  document.querySelector('.health-bar .text').innerHTML = `${health}`;
  document.querySelector('.coinContainer .coin').innerHTML = `${coin}`;

  if (explore >= 3) {
    btn2.style.display = "block";
    btn3.style.display = "block";
    btn2.innerHTML = "slime field";
    btn3.innerHTML = "heal";
  }
  // ...
});

//To view the btn2
let explore = 0;

let health = 100;
let coin = 0;

function gameOver() {
  if (health <= 0) {
    saveProgress();
    msgScreen.innerHTML = "<span class = 'damageMsg'>game over</span>";
    document.querySelectorAll('#btn1, #btn2, #btn3, #btn4').forEach(button => button.style.display = "none");
    const btnContainer = document.querySelector('.btncontainer');
    const respawnbtn = document.createElement('button');
    respawnbtn.classList.add('button');
    respawnbtn.id = 'respawnbtn';
    respawnbtn.textContent = 'respawn';
    btnContainer.appendChild(respawnbtn);

    health = retrieveProgress().health;
    coin = retrieveProgress().coin;

    respawnbtn.disabled = true;
    respawnbtn.style.cursor = "not-allowed";
    setTimeout(() => {
      respawnbtn.disabled = false;
      respawnbtn.style.cursor = "pointer";
    }, 1000);

    respawnbtn.addEventListener("click", () => {
      console.log("respawn");
      respawnbtn.remove();
      document.querySelectorAll('#btn1, #btn2, #btn3').forEach(button => button.style.display = "block");
      msgScreen.innerHTML = "You woke up feeling hurt, but you are still alive. Keep eating apples. <span class = 'damageMsg'><br>You lost 10 coins</span>";
      health = 20;
      document.querySelector('.health-bar .inner').style.width = `${health}%`;
      document.querySelector('.health-bar .text').innerHTML = `${health}`;
      coin -= 10;
      document.querySelector('.coinContainer .coin').innerHTML = `${coin}`;
      saveProgress();
    });
  }
}

//audio
const click = document.getElementById("click");

const items = ["rock", "stick", "fiber", "apple", "mushroom"];

function createInventoryFromItemsArray() {
  inventory = items.map(name => {
    return { name, quantity: 0 };
  });
}

createInventoryFromItemsArray();

inventory.push({ name: "sword", quantity: 1 });

document.getElementById("inventoryView").addEventListener("click", () => {
  click.play()
  displayInventory();
});

// Function to display inventory
function displayInventory() {
  msgScreen.innerHTML = "Inventory:<br>";
  inventory.forEach(item => {
    if (item.quantity === 0) {
      return;
    } else if (item.quantity >= 1) {
      msgScreen.innerHTML += `${item.name} x${item.quantity}<br>`;
    }
  });
}

// Function to increase quantity of an item
function increaseQuantity(itemName, amount) {
  let item = inventory.find(i => i.name.toLowerCase() === itemName.toLowerCase());
  if (item) {
    item.quantity += amount;
  }
}

// Increase quantity of rock by 2
increaseQuantity("Rock", 2);

btn1.innerHTML = "explore";

btn1.addEventListener("click", () => {
  click.play()
  let ranitem = items[Math.floor(Math.random() * items.length)];
  console.log(ranitem);
  increaseQuantity(ranitem, 1);
  msgScreen.innerHTML = `You walked through the forest and found a ${ranitem}!`;
  explore += 1;
  if (explore == 3) {
    btn2.style.display = "block";
    btn3.style.display = "block";
    btn2.innerHTML = "slime field";
    btn3.innerHTML = "heal";
    msgScreen.innerHTML = `You walked through the forest and found a ${ranitem}! <br> <em>You also found a slime field.</em>`;
  }
  btn1.disabled = true;
  btn1.style.cursor = "not-allowed";
  setTimeout(() => {
    btn1.disabled = false;
    btn1.style.cursor = "pointer";
  }, 100);
  saveProgress();
});

btn2.addEventListener("click", () => {
  click.play()
  if (btn2.innerHTML == "slime field") {
    health -= 10;
    coin += 10;
    msgScreen.innerHTML = `You were walking through the slime field and a slime attacked you!<br><span class="damageMsg">You took 10 damage.</span><br>You swung your sword and hit the slime.<br><em>you killed the slime.</em>`;
    document.querySelector('.health-bar .inner').style.width = `${health}%`;
    document.querySelector('.health-bar .text').innerHTML = `${health}`;
    document.querySelector('.coinContainer .coin').innerHTML = `${coin}`;
    gameOver();
    saveProgress();
  }
});

btn3.addEventListener("click", () => {
  click.play()
  if (btn3.innerHTML == "heal") {
    let apple = inventory.find(i => i.name.toLowerCase() === "apple");
    if (health == 100) {
      msgScreen.innerHTML = `<span class="damageMsg">You are already at full health.</span>`;
    } else if (apple && apple.quantity > 0) {
      health += 10;
      apple.quantity -= 1;
      msgScreen.innerHTML = `<em>You healed 10 health.</em>`;
      document.querySelector('.health-bar .inner').style.width = `${health}%`;
    } else {
      msgScreen.innerHTML = `<span class="damageMsg">You don't have an apple. Try exploring the forest.</span>`
    }
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
  };
  localStorage.setItem("progressData", JSON.stringify(progressData));
};

// Retrieve progress data from local storage
function retrieveProgress() {
  const progressData = localStorage.getItem("progressData");
  if (progressData) {
    const data = JSON.parse(progressData);
    return data; // Return the parsed progress data
  } else {
    return { health: 100, coin: 0, explore: 0 }; // Return default values if no progress data is found
  }
};
