export async function streamAI(endpoint, text, onChunk) {
    const response = await fetch(`http://127.0.0.1:8000/api/ai/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });

    if (!response.ok) throw new Error("AI request failed");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let result = "";

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        result += chunk;

        onChunk(result);
    }

    return result;
}
