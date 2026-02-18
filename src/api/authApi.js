const BASE_URL = "http://127.0.0.1:8000/api/auth";

export async function signupUser(name, email, password) {
    const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) throw new Error("Signup failed");
    return res.json();
}

export async function loginUser(email, password) {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");
    return res.json();
}
