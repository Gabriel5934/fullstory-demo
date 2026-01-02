import { useEffect, useState } from "react";
import "./App.css";
import { FullStory, init } from "@fullstory/browser";

function App() {
  const [displayName, setDisplayName] = useState("");

  const isEnabled = import.meta.env.VITE_FULLSTORY_ENABLED === "true";

  useEffect(() => {
    if (isEnabled) {
      init({
        orgId: import.meta.env.VITE_FULLSTORY_ORG_ID,
        devMode: false, //import.meta.env.DEV,
      });
    }
  }, [isEnabled]);

  const identify = () => {
    FullStory("setIdentity", {
      uid: displayName.replace(/ /g, "").toLowerCase(),
      properties: {
        displayName: displayName,
        email: displayName.replace(/ /g, "").toLowerCase() + "@example.com",
      },
    });
  };

  return (
    <>
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <button onClick={identify}>Identify</button>
    </>
  );
}

export default App;
