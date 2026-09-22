import { Application, Assets, Sprite } from "pixi.js";
import { CombatArea } from "./base";
import { saveData } from "./backend_service";


(async () => {
  // Create a new application
  const app = new Application();
  // Initialize the application
  await app.init({ background: "#cae2fc", resizeTo: window });
  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  //-------------------------------------------
  
  const CASIZE = {height: 800, width: 1400};
  const ActiveObjectList = [
    {
      id: "Corvet01",
      type: "corvet",
      position: {x: 1300, y: 400},
      direction: 270,
      weaponConfig: ['howitzer']
    },

    {
      id: "Fregate01",
      type: "fregate",
      position: {x: 40, y: 450},
      direction: 90,
      weaponConfig: ['howitzer', 'ak630']
    }
  ];

  const session_id = "session_" + Date.now();

  const CABase = new CombatArea(CASIZE, ActiveObjectList, app.stage);
  CABase.showCurrentState();

  // -------------------------------------------
  // Listen for animate update
  app.ticker.add((time) => {;
    CABase.update(time.deltaMS / 1000, time.lastTime, session_id);
  });
})();
