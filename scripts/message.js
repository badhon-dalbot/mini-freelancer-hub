const API_BASE = "https://freelancerhubbackend.onrender.com/api";
let currentConversationId = null;

const userList = document.getElementById("userList");
const messagesDiv = document.getElementById("messages");

// Get token and user from localStorage
function getToken() {
    return `Bearer ${localStorage.getItem("token")}`;
}
const user = JSON.parse(localStorage.getItem("user") || "{}");
const userId = user.id; // logged-in user id

// --- Load users ---
fetch(`${API_BASE}/users`, { headers: { Authorization: getToken() } })
  .then(res => res.json())
  .then(data => {
    data.users.forEach(u => {
      const li = document.createElement("li");
      li.className = "user-item";

      // Avatar
      const img = document.createElement("img");
      img.src = u.avatar_url || "fallback.png";
      img.alt = `${u.first_name || ""} ${u.last_name || ""}`;
      img.className = "avatar";

      // Name
      const span = document.createElement("span");
      span.textContent = `${u.first_name || ""} ${u.last_name || ""}`;

      li.appendChild(img);
      li.appendChild(span);

      li.onclick = () => startConversation(u.user_id);
      userList.appendChild(li);
    });
});

// --- Start conversation ---
function startConversation(freelancerId) {
    fetch(`${API_BASE}/conversations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: getToken()
        },
        body: JSON.stringify({
            client_id: userId,
            freelancer_id: freelancerId
        })
    })
        .then(res => res.json())
        .then(data => {
            currentConversationId = data.conversation_id;
            joinConversation(currentConversationId);
            loadMessages(currentConversationId);
        });
}

// --- Load old messages ---
function loadMessages(conversationId) {
    messagesDiv.innerHTML = "";
    fetch(`${API_BASE}/messages/${conversationId}`, {
        headers: { Authorization: getToken() }
    })
        .then(res => res.json())
        .then(messages => {
            messages.forEach(msg => addMessage(msg, msg.sender_id === userId));
        });
}

// --- Socket.IO ---
const socket = io("https://freelancerhubbackend.onrender.com", {
    auth: { token: getToken() }
});

function joinConversation(conversationId) {
    socket.emit("joinConversation", conversationId);
}

socket.on("newMessage", msg => {
    addMessage(msg, msg.sender_id === userId);
});

// --- Send message ---
document.getElementById("sendBtn").addEventListener("click", () => {
    const body = document.getElementById("messageInput").value.trim();
    if (!body || !currentConversationId) return;

    socket.emit("sendMessage", {
        conversation_id: currentConversationId,
        sender_id: userId,
        message_body: body
    });

    document.getElementById("messageInput").value = "";
});

// --- Render message ---
function addMessage(msg, isMe) {
    const div = document.createElement("div");
    div.className = "msg " + (isMe ? "me" : "other");
    div.textContent = msg.message_body;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}