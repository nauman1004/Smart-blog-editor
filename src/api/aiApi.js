const BASE_URL = "http://127.0.0.1:8000/api/ai";

function getToken() {
    return localStorage.getItem("token");
}

export async function generateSummary(text) {
    const res = await fetch(`${BASE_URL}/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error("AI request failed");
    return res.json();
}
