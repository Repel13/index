const API_KEY = "AIzaSyCzG3fXh5TbDLBa8O7YOd9ZOHzrX1u-r6o";

document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.getElementById("chatInput");
    const chatBox = document.getElementById("chatBox");
    const chatSendBtn = document.getElementById("chatSendBtn");

    async function sendChatMessage() {
        const input = chatInput.value.trim();
        if (!input) return;

        // tampilkan user message
        chatBox.innerHTML += `
            <div style="margin-bottom:10px;">
                <b>Kamu:</b><br>${input}
            </div>
        `;

        chatInput.value = "";

        // loading AI
        const loadingId = "loading-msg";
        chatBox.innerHTML += `
            <div id="${loadingId}">
                <b>AI:</b><br>Mengetik...
            </div>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    { text: input }
                                ]
                            }
                        ]
                    })
                }
            );

            const result = await response.json();

            console.log("RESPONSE:", result); // 🔥 penting untuk debug

            document.getElementById(loadingId)?.remove();

            const reply =
                result?.candidates?.[0]?.content?.parts?.[0]?.text
                ?? "AI tidak merespon / API error";

            chatBox.innerHTML += `
                <div style="margin-bottom:10px;">
                    <b>AI:</b><br>${reply}
                </div>
            `;

        } catch (err) {
            console.error(err);

            document.getElementById(loadingId)?.remove();

            chatBox.innerHTML += `
                <div style="color:red;">
                    <b>AI:</b><br>Error koneksi ke API
                </div>
            `;
        }

        chatBox.scrollTop = chatBox.scrollHeight;
    }

    chatSendBtn?.addEventListener("click", sendChatMessage);

    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendChatMessage();
    });
});