const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const userName = document.getElementById('user-name');
const userList = document.getElementById('users');

// Message from server
const socket = io();


// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
userName.innerText = `Hi ${username}, welcome to CharCord!`;

 // Get a unique device ID from localStorage
 let deviceId = localStorage.getItem('deviceId');
 if (!deviceId) {
     deviceId = Math.random().toString(36).substring(2, 20);
     localStorage.setItem('deviceId', deviceId);
 }
console.log(deviceId,"deviceId")
 // Send the device ID to the server
 socket.emit('deviceId', deviceId);
 
 //send username to backend
 socket.emit('name',username)
// client-side
socket.emit("hello", "world");


socket.on('message', (message) => {
    console.log(message, "message");
    outputMessage(message);
    
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
  

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    // Get message text
    let msg = e.target.elements.msg.value;
  
    msg = msg.trim();
  
    if (!msg) {
      return false;
    }
  
    // Emit message to server
    socket.emit('chatMessage', msg);
    socket.emit('deviceId', deviceId);
  
    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
  });

  function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
    if (message.username !== "ChatCord Bot") {
       div.classList.add("not-bot")
    }
  }

 
  document.getElementById('leave-btn').addEventListener('click', () => {
    window.location = '../index.html';
  });
  