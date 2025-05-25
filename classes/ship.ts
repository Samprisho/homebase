import {
  Box3,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  Object3DEventMap,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  Vector3,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { InputKey, MouseInput, Orientation } from "./input";
import { clamp, degToRad, lerp } from "three/src/math/MathUtils";
import { Debug } from "./debug";
import { Bullet, PlayerBullet } from "./bullets";
import { Cam } from "./cam";

const loader = new GLTFLoader();

export class Ship extends Object3D<Object3DEventMap> {
  ship: Object3D<Object3DEventMap>;
  scene: Scene;
  camera: Cam;

  w = new InputKey("w");
  s = new InputKey("s");
  a = new InputKey("a");
  d = new InputKey("d");
  /*   sp = new InputKey(" ");
  j = new InputKey("j"); */
  mouse = new MouseInput();

  delta: number = 0;

  bounds = new Vector2(5, 4);

  velocityDebug = Debug.createDebugText("vel");
  orientationDebug = Debug.createDebugText("ori");

  velocity: Vector2 = new Vector2(0, 0);
  accelaration: number = 0.8;
  deaccelaration: number = 5;
  maxSpeed: number = 0.2;

  barrelRollOnCooldown: boolean = true;
  barrelRollValue: number = 0;
  barrelRollTime = 0;
  barrelRollDir: number = 0;
  /**
   * Time in milliseconds.
   * Note that *we stop applying barrel roll veolcity at half* of `barrelRollTimeTotal`.
   * **See line 113.**
   */
  barrelRollTimeTotal: number = 500;
  barrelRollVelocityBonus: number = 5;
  /**
   * **MUST BE A WHOLE NUMBER**
   */
  numberOfBarrelRolls: number = 1;

  cursor: Box3 = new Box3(new Vector3(), new Vector3());
  cursorMesh: Mesh = new Mesh(new SphereGeometry(), new MeshPhongMaterial());

  constructor(scene: Scene) {
    super();

    this.barrelRollValue = 0;

    this.scene = scene;

    loader.load("/Ship.glb", async (gltf) => {
      this.ship = gltf.scene.children[0];

      this.ship.position.set(0, -1, -3);
      this.ship.rotation.setFromVector3(
        new Vector3(degToRad(0), degToRad(180), degToRad(0))
      );

      scene.add(this.ship);
    });

    this.d.onDoublePressed = this.barrelRollRight.bind(this);
    this.a.onDoublePressed = this.barrelRollLeft.bind(this);
    /*     this.sp.onPressed = this.shoot.bind(this);
    this.j.onPressed = this.shoot.bind(this); */
    this.mouse.onMove = this.mouseMove.bind(this);
    this.mouse.onClick = this.shoot.bind(this);

    scene.add(this.cursorMesh);

    let ori = new Orientation();
    /* ori.handleOrientation = (event) => {
      console.log("ss");
      console.log(event);
      this.orientationDebug.textContent = `${event}`;
    }; */
  }

  update(delta: number) {
    if (!this.ship) return;

    this.delta = delta;

    this.velocity = this.v2Lerp(
      this.velocity,
      new Vector2(0, 0),
      delta * this.deaccelaration
    );

    let moveDir: Vector2 = new Vector2(0, 0);

    if (this.w.isHeld) {
      moveDir.setY(1);
    }

    if (this.s.isHeld) {
      moveDir.setY(-1);
    }

    if (this.a.isHeld) {
      moveDir.x = -1;
    }

    if (this.d.isHeld) {
      moveDir.x = 1;
    }

    // Calculate Barrel roll velocity
    if (!this.barrelRollOnCooldown) {
      this.barrelRollValue = lerp(
        this.barrelRollValue,
        360 * this.numberOfBarrelRolls * this.barrelRollDir,
        this.barrelRollTime / this.barrelRollTimeTotal
      );
      this.barrelRollTime += this.delta * 1000;

      // Ensure we don't add velocity when we aren't rolling anymore
      if (this.barrelRollTime / this.barrelRollTimeTotal < 0.5) {
        this.velocity.add(
          new Vector3(
            this.barrelRollDir *
              delta *
              this.barrelRollVelocityBonus *
              (1 - this.barrelRollTime / this.barrelRollTimeTotal),
            0,
            0
          )
        );
      }
    }

    // add veclotiy from basic wasd input
    this.velocity.x += moveDir.x * delta * this.accelaration;
    this.velocity.y += moveDir.y * delta * this.accelaration;

    // Clamp velocity to maxSpeed
    this.velocity.x = clamp(this.velocity.x, -this.maxSpeed, this.maxSpeed);
    this.velocity.y = clamp(this.velocity.y, -this.maxSpeed, this.maxSpeed);

    // For debug text
    this.velocityDebug.textContent = `${this.velocity.toArray()}`;

    // Apply velocity
    this.ship.position.add(new Vector3(this.velocity.x, this.velocity.y, 0));

    // Animate ship's orientation
    this.ship.rotation.setFromVector3(
      new Vector3(
        degToRad((this.velocity.y / this.maxSpeed) * 30),
        degToRad((this.velocity.x / this.maxSpeed) * -15 + 180),
        degToRad((this.velocity.x / this.maxSpeed) * 30 + this.barrelRollValue)
      )
    );

    // Clamp ship to bounds
    this.ship.position.set(
      clamp(this.ship.position.x, -this.bounds.x, this.bounds.x),
      clamp(this.ship.position.y, -this.bounds.y, this.bounds.y),
      this.ship.position.z
    );
  }

  v3Lerp(x: Vector3, y: Vector3, t: number): Vector3 {
    let result: Vector3 = new Vector3(0, 0, 0);

    result.x = lerp(x.x, y.x, t);
    result.y = lerp(x.y, y.y, t);
    result.z = lerp(x.z, y.z, t);

    return result;
  }

  v2Lerp(x: Vector2, y: Vector2, t: number): Vector2 {
    let result: Vector2 = new Vector2(0, 0);

    result.x = lerp(x.x, y.x, t);
    result.y = lerp(x.y, y.y, t);

    return result;
  }

  barrelRollLeft() {
    if (this.barrelRollOnCooldown == false) return;
    this.barrelRollOnCooldown = false;
    this.barrelRollValue = 0;
    this.barrelRollTime = 0;
    this.barrelRollDir = -1;

    setTimeout(() => {
      this.barrelRollOnCooldown = true;
      this.barrelRollDir = 0;
    }, this.barrelRollTimeTotal);
  }

  barrelRollRight() {
    if (this.barrelRollOnCooldown == false) return;
    this.barrelRollOnCooldown = false;
    this.barrelRollValue = 0;
    this.barrelRollTime = 0;
    this.barrelRollDir = 1;

    setTimeout(() => {
      this.barrelRollOnCooldown = true;
      this.barrelRollDir = 0;
    }, this.barrelRollTimeTotal);
  }

  handleOrientation(event) {
    console.log(event);
  }

  shoot(event) {
    let target = this.ship.position.clone();
    target.z -= 50000;

    target = this.cursorMesh.position;

    const bullet = new PlayerBullet(this.ship.position, target, 20, 1);
  }

  mouseMove(event: MouseEvent) {
    const c = document.getElementById("c");
    let pos = new Vector2(event.clientX, event.clientY);
    pos.divide(new Vector2(c.clientWidth, c.clientHeight));

    // Couldn't figure out how to project mouse coordinates to
    // world coordinates, so I'm going with a hacky solution

    pos.set(
      lerp(-this.bounds.x, this.bounds.x, pos.x),
      lerp(-this.bounds.y, this.bounds.y, 1 - pos.y)
    );

    console.log(`${pos.toArray()}`);

    pos.multiplyScalar(2.4);

    this.cursorMesh.position.set(pos.x, pos.y, -10);
  }
}
