import * as Element from "../viewpage/element.js";

export function mode() {
  let lightMode = localStorage.getItem("lightmode");

  const enableLightMode = () => {
    document.body.classList.add("lightmode");
    localStorage.setItem("lightmode", "enabled");
  };
  const disableLightMode = () => {
    document.body.classList.remove("lightmode");
    localStorage.setItem("lightmode", null);
  };

  let lightModeButton = Element.buttonLightMode;
  let darkModeButton = Element.buttonDarkMode;

  if (lightMode === "enabled") {
    enableLightMode();
  }
  lightModeButton.addEventListener("click", () => {
    lightMode = localStorage.getItem("lightmode");
    enableLightMode();
  });

  darkModeButton.addEventListener("click", () => {
    lightMode = localStorage.getItem("lightmode");
    disableLightMode();
  });
}
