const moment = require('moment');

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

 const botMessage = `Hi, welcome to chatbot 

    - Select 1 to place an order
    - Select 99 to checkout order
    - Select 98 to see order history
    - Select 97 to see current order
    - Select 0 to cancel order
   `
  const menuselection = 
   `- Select 1 to place an order
   - Select 99 to checkout order
   - Select 98 to see order history
   - Select 97 to see current order
   - Select 0 to cancel order`

  const menuOptions = 
  ` 
  - Select 99 to checkout order
   - Select 98 to see order history
   - Select 97 to see current order
   - Select 0 to cancel order
  `

  const menu = {
    food: {
      2: "fried rice and beans",
      3: "jollof rice",
      4: "porridge yam",
      5: "coconur rice",
      6: "swallow",
      7: "shawarma",
      8: "Burger",
      9: "white rice and stew"
    },
    drinks: {
      8: "Juice",
      2: "coke",
      3: "sprite",
      5: "fanta",
      6: "Hollandia Yoghurt",
      7: "Water"
    },
    toppings: {
       8: "meat",
       2: "fish",
       3: "egg",
       4: "croaker",
       5:"coleslaw",
       6:"Plantain"
    }
  
  }
  
  let order = {
    food: [],
    drinks: [],
    toppings: [],
    ordermade:''
  }
  
  const getMenu = (items)=>{
    let a = `Please select the right number to make an order \n`
    for (const [key, value] of Object.entries(items)) {
       a = a + `${key}: ${value} \n`;
   
    }
    return a
  }
  
  const drinkskey = Object.keys(menu.drinks).map((item)=> parseInt(item)) 
  const Foodkey = Object.keys(menu.food).map((item)=> parseInt(item))
  const toppingskey = Object.keys(menu.toppings).map((item)=> parseInt(item))
  
  function checkDuplicateOrders(array){
    const counts = {};
      array.forEach((item) => {
        counts[item] = (counts[item] || 0) + 1;
      });
      const modifiedItems = array.map((item) => {
        if (counts[item] > 1) {
          return `${item}(x${counts[item]})`;
        }
        return item;
      });
      const unique_array = modifiedItems.filter((element, index, array) => {
        return array.indexOf(element) === index;
      });
      return unique_array
  }

module.exports = {formatMessage, menuOptions, menuselection, botMessage, menu, order, getMenu, drinkskey, Foodkey ,toppingskey, checkDuplicateOrders};
