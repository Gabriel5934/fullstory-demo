import { useEffect, useState } from "react";
import "./App.css";
import { FullStory, init } from "@fullstory/browser";

function App() {
  const [displayName, setDisplayName] = useState<string | null>(
    localStorage.getItem("displayName") ?? null
  );
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#e66465");

  const isEnabled = import.meta.env.VITE_FULLSTORY_ENABLED === "true";

  useEffect(() => {
    if (!isEnabled) return;

    init({
      orgId: import.meta.env.VITE_FULLSTORY_ORG_ID,
      devMode: import.meta.env.DEV,
      startCaptureManually: true,
    });
  }, [isEnabled]);

  const login = () => {
    if (!displayNameInput) return;

    localStorage.setItem("displayName", displayNameInput);
    setDisplayName(displayNameInput);

    // Set the user to identified
    FullStory("setIdentity", {
      uid: displayNameInput.replace(/ /g, "").toLowerCase(),
      properties: {
        displayName: displayName,
        email:
          displayNameInput.replace(/ /g, "").toLowerCase() + "@example.com",
      },
    });
  };

  const logout = () => {
    FullStory("setIdentity", {
      anonymous: true,
    });

    localStorage.removeItem("displayName");
    setDisplayName(null);
    setDisplayNameInput("");
    FullStory("shutdown");
  };

  const startCapture = () => {
    FullStory("start");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        backgroundColor: backgroundColor,
        padding: "10px",
        borderRadius: "10px",
        width: "100%",
        height: "100%",
      }}
    >
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
      <button onClick={startCapture}>Start Capture</button>
      <button
        id="big-orange-button"
        style={{ backgroundColor: "orange", color: "white" }}
      >
        Big Orange Button
      </button>
      <input
        type="color"
        id="foreground"
        name="foreground"
        value={backgroundColor}
        onChange={(e) => setBackgroundColor(e.target.value)}
      />
    </div>
  );
}

export default App;
