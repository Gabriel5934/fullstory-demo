import { useEffect, useRef, useState } from "react";
import "./App.css";
import { FullStory, init } from "@fullstory/browser";

function App() {
  const [displayName, setDisplayName] = useState<string | null>(
    localStorage.getItem("displayName") ?? null
  );
  const [displayNameInput, setDisplayNameInput] = useState("");
  const isInitialized = useRef(false);

  const isEnabled = import.meta.env.VITE_FULLSTORY_ENABLED === "true";

  useEffect(() => {
    console.debug("isEnabled", isEnabled);
    console.debug("displayName", displayName);
    console.debug("isInitialized.current", isInitialized.current);
    if (isEnabled && displayName && !isInitialized.current) {
      console.debug("Initializing FullStory");
      init({
        orgId: import.meta.env.VITE_FULLSTORY_ORG_ID,
        devMode: import.meta.env.DEV,
      });
      isInitialized.current = true;
    }
  }, [isEnabled, displayName]);

  const identify = () => {
    if (!displayName) return;

    FullStory("setIdentity", {
      uid: displayName.replace(/ /g, "").toLowerCase(),
      properties: {
        displayName: displayName,
        email: displayName.replace(/ /g, "").toLowerCase() + "@example.com",
      },
    });
  };

  const login = () => {
    localStorage.setItem("displayName", displayNameInput);
    setDisplayName(displayNameInput);
  };

  const initSession = () => {
    login();
    identify();
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
        <button onClick={initSession}>Log in</button>
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
