import React from "react";

export default function InstallApp() {
    
  const onInstallApp = async () => {
    if (appInstallPrompt) {
      appInstallPrompt.prompt();
      appInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          // User accepted the install prompt
          setisAppInstalled(true);
        } else {
          // User dismissed the install prompt
          setisAppInstalled(false);
        }
      });
    }
  };

  useEffect(() => {
    const installApp = (e) => {
      e.preventDefault();
      setAppInstallPrompt(e);

      // Optionally, you can check if the app is already installed as standalone
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true
      ) {
        setisAppInstalled(true);
      } else {
        setisAppInstalled(false);
      }
    };

    window.addEventListener("beforeinstallprompt", installApp);

    return () => {
      window.removeEventListener("beforeinstallprompt", installApp);
    };
  }, []);
  return <div>InstallApp</div>;
}
