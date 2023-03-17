let {botMessage,formatMessage, menuOptions, menuselection, menu,  getMenu, drinkskey, Foodkey,order ,toppingskey, checkDuplicateOrders} = require("../utils/messages")
const OrderModel = require("../Model/order")
const moment = require("moment")
const socketio = require("socket.io");
const {server} = require("../server")
const {
  userLeave,
  getRoomUsers,
} = require("../utils/users"); 

const io = socketio(server);


exports.orderLogic = async ({io, msg, deviceID, room, botName})=>{
    
  console.log(msg,"messageeeeeeeeee")
 let resp = ''
  console.log(parseInt(msg) ==0)
  
  //To cancel order
  if(parseInt(msg) == 0){
 
    resp = `Order cancelled 
      You can proceed to order by selecting from the menu:
       ${menuselection}`
     order = {
         food: [],
         drinks: [],
         toppings: [],
         ordermade:''
       }
   resp && io.to(room).emit("message", formatMessage(botName, resp));
   return
  }
  
  //View current order
  if (parseInt(msg) == 97 && order.ordermade) {
    console.log(order.ordermade, "ordermade")
    
      resp = `Here is your current order
              Food: ${checkDuplicateOrders(order.food).toString() || 'None added'}
              Drinks: ${checkDuplicateOrders(order.drinks).toString() || 'None added'}
              Toppings: ${checkDuplicateOrders(order.toppings).toString() || 'None added'}

              Select 34 to keep ordering
       `
   resp && io.to(room).emit("message", formatMessage(botName, resp));
   return
  } 
  
  //View current order
  if (parseInt(msg) == 97 && !order.ordermade) {
   resp = `No order made yet
            ${menuselection}
         
    `

   resp && io.to(room).emit("message", formatMessage(botName, resp));
   return
   } 

   //Keep ordering
  if(parseInt(msg) == 34 && order.ordermade){
      resp = `Select 14 to order drinks
              Select 12 to order toppings
              Select 13 to order food
              ${menuOptions}`
    resp && io.to(room).emit("message", formatMessage(botName, resp));
    return
  }

  //See order History
  if (parseInt(msg)==98) {
     console.log(deviceID,"deviceID")
       const data = await OrderModel.find({"orderId": deviceID})
       if(data.length>0){
         let a = ''
         data.map((item)=>{

             a = a + `Order made on ${moment(item.created_at).format('MMMM Do YYYY, h:mm:ss a')}
                   Food :${item.food.length>0 && item.food.toString()}
                    drinks: ${item.drinks.length>0 && item.drinks.toString()}
                    Toppings: ${item.toppings.length>0 && item.toppings.toString()}

             `
         })
         resp = a
         console.log(resp, a)
         resp && io.to(room).emit("message", formatMessage(botName, resp));
         return
       }
       resp = `No order has been made
             Follow the options to make an order
             ${menuselection}
             `
       resp && io.to(room).emit("message", formatMessage(botName, resp));
       return
  }

  //To checkout order
  if (parseInt(msg) == 99) {

     if(!order.ordermade){
       resp =`No order to place

             ${menuselection}
          `
       resp && io.to(room).emit("message", formatMessage(botName, resp));
       return
     } 
      resp = `
               Order Placed
               Food: ${checkDuplicateOrders(order.food).toString() || 'None added'}
               Drinks: ${checkDuplicateOrders(order.drinks).toString() || 'None added'}
               Toppings: ${checkDuplicateOrders(order.toppings).toString() || 'None added'}
               Thank you for your order, we hope to see you next time
             `
     resp && io.to(room).emit("message", formatMessage(botName, resp));
     
     const data = await OrderModel.create({
                 orderId: deviceID, 
                 food: checkDuplicateOrders(order.food), 
                 drinks: checkDuplicateOrders(order.drinks),  
                 toppings: checkDuplicateOrders(order.toppings)
             })
    console.log(data,"success")
    return
  }

  //For making orders
  if(parseInt(msg) == 1){
  
   order.ordermade = "food"
    resp = getMenu(menu.food)
    
   io.to(room).emit("message", formatMessage(botName, resp));
   return
  }
  if (Foodkey.includes(parseInt(msg)) && order.ordermade == 'food') {
    order.ordermade = "food"
     order.food.push(menu.food[parseInt(msg)])
    resp = `Ordered added \n
        Select 14 to order drinks
        Select 12 to order toppings
        Select 13 to order more food
        ${menuOptions}`
   resp && io.to(room).emit("message", formatMessage(botName, resp));
   return
  }
  if (parseInt(msg)==13 && order.ordermade) {
      order.ordermade = "food"
     resp =`Alright, order more food
              ${getMenu(menu.food)}
              ${menuOptions}`
     resp && io.to(room).emit("message", formatMessage(botName, resp));
     return 
  }

  //drinks
  if (parseInt(msg)==14 && order.ordermade) {
      order.ordermade = "drinks"
      resp = `Make order for drinks
               ${getMenu(menu.drinks)}
               ${menuOptions}`
   resp && io.to(room).emit("message", formatMessage(botName, resp));
   return   
  }
  if (drinkskey.includes(parseInt(msg)) && order.ordermade == 'drinks') {
   order.drinks.push(menu.drinks[parseInt(msg)])
  resp = `Ordered added \n
      Select 14 to order more drinks
      Select 12 to order toppings
      Select 13 to order food
      ${menuOptions}`
  resp && io.to(room).emit("message", formatMessage(botName, resp));
   return
   }
 
//toppings

  if (parseInt(msg)==12 && order.ordermade) {
    order.ordermade = "toppings"
   resp = `Make order for toppings
            ${getMenu(menu.toppings)}
            ${menuOptions}`
    resp && io.to(room).emit("message", formatMessage(botName, resp));
   return
  }
  if (toppingskey.includes(parseInt(msg)) && order.ordermade == 'toppings') 
  {
   order.toppings.push(menu.toppings[parseInt(msg)])
   resp = `Ordered added \n
      Select 14 to order drinks
      Select 12 to order more toppings
      Select 13 to order food
      ${menuOptions}
      `
   resp && io.to(room).emit("message", formatMessage(botName, resp));
   return
   }
 
    

  order.ordermade? resp  = `Incorrect option entered
                            Please follow the options to complete your order
                             Select 14 to order drinks
                              Select 12 to order more toppings
                              Select 13 to order food 
                              ${menuOptions}`
  :
  resp =  ` Incorrect option entered
             Please follow the option to continue with your order
               ${menuselection}
          `
  
console.log(order, "order")
 resp && io.to(room).emit("message", formatMessage(botName, resp));
}

exports.fullOrderLogic = async(req,res)=>{
    const {username, deviceID, msg} = req.body
    
  io.on("connection", (socket) => {
  const botName = "ChatCord Bot";
  //const username = 'dinma'
  socket.on("hello", (arg) => {
    console.log(arg); // world
  });
  

  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
   users.push({
     userID: id,
     username: socket.username || username,
    });
  }
  //console.log(users,"users")
    let deviceID
  //get device ID
   
  /*socket.on('deviceId', deviceId => {
    console.log(deviceId, "deviceid iddddddddd")
    deviceID = deviceId
    
    })*/
   const room = "room1"
     socket.join(room)
    
 // console.log(users,"userssssss")
  //io.to(room).emit("users", users);
     
   // Welcome current user when user joins room
   
   io.to(room).emit("message", formatMessage(botName, botMessage)); 
   


  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {  

    io.to(room).emit("message", formatMessage(username, msg));
    
    console.log(msg, "message", Number.isInteger(msg), parseInt(msg), deviceID)

    socket.on('deviceid', deviceId => {
      console.log(deviceId, "deviceid iddddddddd")
    
     this.orderLogic({io,msg, deviceID : deviceId,room, botName})
      })
      this.orderLogic({io,msg, deviceID,room, botName})
     
  });

  // Runs when client disconnects
  socket.on("disconnect", ()  => {
    const user = userLeave(socket.id)
 
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
      io.to(room).emit("message", formatMessage(botName, "Left the ChatCord!"));

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });  
});

}

