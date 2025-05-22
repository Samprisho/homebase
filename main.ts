import * as THREE from "three";
import { Cam } from "./classes/cam";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

(function () {
  "use strict";

  window.addEventListener("load", init);

  function init() {
    const loader = new GLTFLoader();
    const clock = new THREE.Clock(true);
    const canvas = id("c");
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    const cam = new Cam(90, 16 / 9, 0.1, 5);

    const scene = new THREE.Scene();

    loader.load("/Ship.glb", (gltf) => {
      scene.add(gltf.scene);
    });

    /*     const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
/*     const cube = new THREE.Mesh(geometry, material);
    scene.add(cube); */

    const sun = new THREE.DirectionalLight(0xffffff, 3);
    sun.position.set(-1, 2, 4);
    scene.add(sun);

    renderer.render(scene, cam);

    function render(time) {
      time *= 0.001; // convert time to seconds

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

      cam.update(clock.getDelta());

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
