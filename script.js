let msgScreen = document.getElementById("msgText");

let btn1 = document.getElementById("btn1");
let btn2 = document.getElementById("btn2");
let btn3 = document.getElementById("btn3");
let btn4 = document.getElementById("btn4");

//To view the btn2
let explore = 0;

let health = 100;
let coin = 0;

//audio
let click = document.getElementById("click");

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
    msgScreen.innerHTML = `You walked throught the forest and found a ${ranitem}!`;
    explore += 1;
    if (explore == 3) {
        btn2.style.display = "block";
        btn3.style.display = "block";
        btn2.innerHTML = "slime field";
        btn3.innerHTML = "heal";
        msgScreen.innerHTML = `You walked through the forest and found a ${ranitem}! <br> <em>You also found a slime field.</em>`;
    }
});

btn2.addEventListener("click", () => {
    click.play()
    if (btn2.innerHTML == "slime field") {
        health -= 10;
        msgScreen.innerHTML = `You were walking through the slime field and a slime attacked you!<br><span class="damageMsg">You took 10 damage.</span><br>You swung your sword and hit the slime.<br><em>you killed the slime.</em>`;
        document.getElementsByClassName("health")[0].innerHTML = ` Health: ${health}`;

    }
});

btn3.addEventListener("click", () => {
    click.play()
    if (btn3.innerHTML == "heal") {
        let apple = inventory.find(i => i.name.toLowerCase() === "apple");
        if (health == 100) {
            msgScreen.innerHTML = `<span class="damageMsg">You are already at full health.</span>`;
        }else if(apple && apple.quantity > 0) {
            health +=10;
            apple.quantity -= 1; 
            msgScreen.innerHTML = `<em>You healed 10 health.</em>`;
        } else {
            msgScreen.innerHTML = `<span class="damageMsg">You don't have an apple. Try exploring the forest.</span>`
        }
        document.getElementsByClassName("health")[0].innerHTML = `Health: ${health}`;
    }
})
//health bar
document.getElementsByClassName("health")[0].innerHTML = ` Health: ${health}`;
