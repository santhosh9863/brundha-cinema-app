"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) router.push("/admin");
    else alert("Invalid login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="p-6 bg-white/10 rounded-xl space-y-4">
        <input placeholder="Username" onChange={(e)=>setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}