import * as THREE from "three";
import { Cam } from "./classes/cam";
import { Ship } from "./classes/ship";

export let gameScene: THREE.Scene = null;
export let bullets: THREE.Group = new THREE.Group();

(function () {
  "use strict";

  window.addEventListener("load", init);

  async function init() {
    const clock = new THREE.Clock(true);
    const canvas = id("c");
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    const cam = new Cam(85, 16 / 9, 0.1, 20);

    const scene = new THREE.Scene();
    const ship = new Ship(scene);
    ship.camera = cam;

    bullets = new THREE.Group();
    gameScene = scene;

    scene.background = new THREE.Color(0x00aaff);

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

    cam.ship = ship;

    scene.add(bullets);

    for (let index = 0; index < 5; index++) {
      const geo = new THREE.BoxGeometry();
      const mat = new THREE.MeshPhongMaterial();
      const cube = new THREE.Mesh(geo, mat);

      cube.position.set(-6 + index * 3, 1, -10);
      scene.add(cube);
    }

    renderer.render(scene, cam);

    function render(time) {
      time *= 0.001; // convert time to seconds
      const delta = clock.getDelta();

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        cam.aspect = canvas.clientWidth / canvas.clientHeight;
        cam.updateProjectionMatrix();
      }

      const canvas = renderer.domElement;
      canvas.tabIndex = 0;
      canvas.focus();

      cam.aspect = canvas.clientWidth / canvas.clientHeight;
      cam.updateProjectionMatrix();

      /*       cube.rotation.x = time;
      cube.rotation.y = time; */

      bullets.children.forEach((bullet) => {
        // @ts-ignore
        bullet.update(delta);
      });

      cam.update(delta);
      ship.update(delta);

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
