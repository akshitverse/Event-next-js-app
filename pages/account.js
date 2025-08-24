import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function Account() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [msg, setMsg] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) loadProfile(u.id);
    });

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) loadProfile(u?.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user profile from public.users table
  async function loadProfile(id) {
    const { data, error } = await supabase
      .from("users")
      .select("id,name,email")
      .eq("id", id)
      .maybeSingle();
    if (!error) setProfile(data ?? null);
  }

  // Delete account API call
  async function deleteAccount() {
    if (
      !confirm(
        "Are you sure you want to delete your account? This will remove your profile, events, and RSVPs."
      )
    )
      return;

    setMsg("Deleting account...");

    // Get current session + access token
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      setMsg("Error: No session found, please log in again.");
      return;
    }

    try {
      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // send JWT
        },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to delete account");

      setMsg("Account deleted. Logging you out...");
      await supabase.auth.signOut();
      router.push("/");
    } catch (err) {
      setMsg("Error: " + (err.message || err));
    }
  }

  return (
    <div className="container">
      <h1>Account</h1>
      {profile ? (
        <div className="card">
          <p>
            <b>Name:</b> {profile.name}
          </p>
          <p>
            <b>Email:</b> {profile.email}
          </p>
          <button onClick={deleteAccount} style={{ color: "red" }}>
            Delete account
          </button>
          <p>{msg}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
