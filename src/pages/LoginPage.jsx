import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const setToken = useAuthStore((state) => state.setToken);
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const data = await loginUser(email, password);
            setToken(data.token);
            navigate("/editor");
        } catch (err) {
            alert("Login failed");
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 border">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800">
                        Login
                    </button>
                </form>

                <p className="text-sm text-gray-500 text-center mt-4">
                    Don't have an account?{" "}
                    <Link className="text-blue-600" to="/signup">
                        Signup
                    </Link>
                </p>
            </div>
        </div>
    );
}
