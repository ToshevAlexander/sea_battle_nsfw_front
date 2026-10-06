import { Application, Assets, Sprite } from "pixi.js";
import { CombatArea } from "./base";
import { saveData } from "./backend_service";


(async () => {
  // Create a new application
  const app = new Application();
  // Initialize the application
  await app.init({ background: "#1364b9", resizeTo: window });
  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  //-------------------------------------------
  
  const CASIZE = {height: 800, width: 1400};
  const ActiveObjectList = [
    {
      id: "1-c-01",
      type: "corvet",
      position: {x: 1300, y: 100},
      direction: 270,
      weaponConfig: ['howitzer'],
      team: 1,
    },

    {
      id: "1-c-02",
      type: "corvet",
      position: {x: 1300, y: 600},
      direction: 270,
      weaponConfig: ['howitzer'],
      team: 1,
    },


    {
      id: "2-f-01",
      type: "fregate",
      position: {x: 40, y: 240},
      direction: 90,
      weaponConfig: ['howitzer', 'ak630'],
      team: 2
    },

    {
      id: "2-f-02",
      type: "fregate",
      position: {x: 40, y: 455},
      direction: 90,
      weaponConfig: ['howitzer', 'ak630'],
      // weaponConfig: [],
      team: 2
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
