import * as THREE from "three";
import { Cam } from "classes/cam";
import { Ship } from "classes/ship";
import { BoxEnemy, Enemy } from "classes/enemies";
import { Bullet } from "classes/bullets";
import { Instancing, instance } from "classes/instancing";
import { CollisionSystem, EntityHitbox } from "classes/collisions";
import { EnemySchema, Phase, Stage } from "classes/stages";

(function () {
  "use strict";

  window.addEventListener("load", init);

  async function init() {
    const begin = qs("main button");
    begin.addEventListener("click", start);
  }

  function start() {
    const main = qs("main");
    main.classList.add("hidden");

    const ui = id("ui");

    const clock = new THREE.Clock(true);
    const canvas = id("c");

    ui.classList.remove("hidden");
    canvas.classList.remove("hidden");

    ui.addEventListener("click", (event) => {
      canvas.focus();
    });

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    const cam = new Cam(85, 16 / 9, 0.1, 20);

    const scene = new THREE.Scene();
    const ship = new Ship();
    scene.add(ship);
    ship.camera = cam;

    scene.background = new THREE.Color(0x000000);

    /*   ship.position.set(0, -2, 2); */

    /*     const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
/*     const cube = new THREE.Mesh(geometry, material);
    scene.add(cube); */

    const sun = new THREE.DirectionalLight(0xffffff, 3);
    sun.position.set(-1, 2, 4);
    scene.add(sun);

    const ambient = new THREE.AmbientLight();
    scene.add(ambient);

    const inst = new Instancing(scene);
    const collision = new CollisionSystem(scene);

    for (let index = 0; index < 5; index++) {
      const cube = new BoxEnemy(new THREE.Vector3(-3 + index * 2, 2, -10));
    }

    const stages = new Array<Stage>();

    const enemySpawn: EnemySchema = {
      name: "box",
      amount: 10,
      path: new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-8, -5, -5),
        new THREE.Vector3(0, 0, -10),
        new THREE.Vector3(1, 0, -5)
      ),
      notifs: [
        {
          time: 0.2,
          event: () => {
            console.log("Notif!");
          },
        },
      ],
      time: 5,
    };
    const phase11 = new Phase(enemySpawn, "phase 1");

    const phase12 = new Phase(enemySpawn, "phase 2");
    const stage1 = new Stage([phase11, phase12]);
    stages.push(stage1);

    renderer.render(scene, cam);

    canvas.tabIndex = 0;
    canvas.focus();

    stages[0].start();

    function render(time) {
      time *= 0.001; // convert time to seconds
      const delta = clock.getDelta();

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        cam.aspect = canvas.clientWidth / canvas.clientHeight;
        cam.updateProjectionMatrix();

        var vec = new THREE.Vector2(); // create once and reuse

        vec.set(canvas.clientWidth, canvas.clientHeight);
        vec.normalize();
        vec.multiplyScalar(cam.aspect * -ship.position.z);

        ship.bounds = new THREE.Vector2(...vec);
      }

      ship.update(delta);
      stages[0].update(delta);

      /*       const canvas = renderer.domElement;
      canvas.tabIndex = 0;
      canvas.focus(); */

      /*       cube.rotation.x = time;
      cube.rotation.y = time; */

      instance.bullets.children.forEach((bullet: Bullet) => {
        bullet.update(delta);
      });

      instance.enemies.children.forEach((enemy: Enemy) => {
        enemy.update(delta);
      });

      collision.update();
      cam.update(delta);

      renderer.render(scene, cam);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = Math.floor(canvas.clientWidth * pixelRatio);
      const height = Math.floor(canvas.clientHeight * pixelRatio);
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }
  }

  /////////////////////////////////////////////////////////////////////
  // Helper functions
  /**
  * Helper function to return the response's result text if successful, otherwise
  * returns the rejected Promise result with an error status and corresponding text
  * @param {object} res - response to check for success/error

  * @return {object} - valid response if response was successful, otherwise rejected
  *                    Promise result
  */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  function id(id) {
    return document.getElementById(id);
  }

  function qs(selector) {
    return document.querySelector(selector);
  }

  function qsa(selector) {
    return document.querySelectorAll(selector);
  }
})();
