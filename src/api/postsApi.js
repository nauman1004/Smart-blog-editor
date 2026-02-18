const BASE_URL = "http://127.0.0.1:8000/api/posts";

function getToken() {
    return localStorage.getItem("token");
}

export async function fetchPosts() {
    const res = await fetch(`${BASE_URL}/`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}

export async function createPost(title) {
    const res = await fetch(`${BASE_URL}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title }),
    });

    if (!res.ok) throw new Error("Failed to create post");
    return res.json();
}

export async function fetchPostById(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    if (!res.ok) throw new Error("Failed to fetch post");
    return res.json();
}

export async function updatePost(id, data) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update post");
    return res.json();
}
