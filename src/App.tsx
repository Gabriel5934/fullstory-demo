import { useState } from "react";
import "./App.css";
import { FullStory, init } from "@fullstory/browser";

function App() {
  const [displayName, setDisplayName] = useState<string | null>(
    localStorage.getItem("displayName") ?? null
  );
  const [displayNameInput, setDisplayNameInput] = useState("");

  const isEnabled = import.meta.env.VITE_FULLSTORY_ENABLED === "true";

  const login = () => {
    if (!displayNameInput) return;

    localStorage.setItem("displayName", displayNameInput);
    setDisplayName(displayNameInput);

    if (isEnabled) {
      console.debug("Initializing FullStory");

      // Initialize FullStory
      init({
        orgId: import.meta.env.VITE_FULLSTORY_ORG_ID,
        devMode: import.meta.env.DEV,
      });

      // Reset session identity to anonymous
      FullStory("setIdentity", {
        anonymous: true,
      });

      // Set the user to identified
      FullStory("setIdentity", {
        uid: displayNameInput.replace(/ /g, "").toLowerCase(),
        properties: {
          displayName: displayName,
          email:
            displayNameInput.replace(/ /g, "").toLowerCase() + "@example.com",
        },
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("displayName");
    setDisplayName(null);
    setDisplayNameInput("");
    FullStory("shutdown");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <h3 style={{ color: "white" }}>{`${
        displayName ? `Logged in as ${displayName}` : "Log in"
      }`}</h3>
      {!displayName && (
        <input
          type="text"
          value={displayNameInput}
          onChange={(e) => setDisplayNameInput(e.target.value)}
        />
      )}
      {displayName ? (
        <button onClick={logout}>Log out</button>
      ) : (
        <button onClick={login}>Log in</button>
      )}
      <button
        id="big-orange-button"
        style={{ backgroundColor: "orange", color: "white" }}
      >
        Big Orange Button
      </button>
    </div>
  );
}

export default App;
