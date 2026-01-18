"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client"; 
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"; 

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user"); 
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    setError(""); 
    const { data, error: authError } = await authClient.signUp.email({
      email,
      password,
      name,
      
      role, 
      callbackURL: "/",
    });

    if (authError) {
      setError(authError.message || "Something went wrong");
      return;
    }
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-xl w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Create Account</h1>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

        <input type="text" placeholder="Full Name" className="w-full p-2 mb-4 border rounded text-black" onChange={(e) => setName(e.target.value)} value={name} />
        <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded text-black" onChange={(e) => setEmail(e.target.value)} value={email} />
        
        {}
        <div className="relative mb-4">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            className="w-full p-2 border rounded text-black"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button type="button" className="absolute right-2 top-2 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {}
        <label className="text-sm font-semibold text-gray-700 mb-1 block">Select Role</label>
        <select 
          className="w-full p-2 mb-6 border rounded text-black bg-white"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleSignUp} className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition">
          Sign Up
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}