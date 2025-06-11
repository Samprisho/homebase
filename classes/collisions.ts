import {
  Box3,
  Box3Helper,
  BufferGeometry,
  Material,
  Mesh,
  NormalBufferAttributes,
  Object3D,
  Object3DEventMap,
  Scene,
} from "three";

export let collisions: CollisionSystem;
let gameScene: Scene;

export class CollisionSystem {
  #allHitboxes: Hitbox[] = [];
  #entityHitboxes: Hitbox[] = [];
  #bulletHitboxes: Hitbox[] = [];

  debugBoxes: boolean = true;

  constructor(scene: Scene) {
    gameScene = scene;
    collisions = this;
  }

  update() {
    // or alternative name
    // Run some foreach() loop
    this.#allHitboxes.forEach((b, i, arr) => {
      if (b.owner == null) {
        this.#allHitboxes.splice(i, 1);
        if (b instanceof EntityHitbox) {
          this.#entityHitboxes.splice(
            this.#entityHitboxes.findIndex((other) => {
              return other == b;
            }),
            1
          );
        } else if (b instanceof BulletHitbox) {
          this.#bulletHitboxes.splice(
            this.#bulletHitboxes.findIndex((other) => {
              return other == b;
            }),
            1
          );
        }
      } else {
        b.update();
      }
    });

    this.#entityHitboxes.forEach((bE, iE, arrE) => {
      this.#bulletHitboxes.forEach((bB, iB, arrB) => {
        if (bE.intersectsBox(bB)) {
          console.log("AAAA");
          bE.collidedWith(bB);
          bB.collidedWith(bE);
        }
      });
    });

    /* 
    this.#entityHitboxes.forEach((eBox, eI) => {
      console.log();
      eBox.update();
      this.#bulletHitboxes.forEach((bBox, bI) => {
        
        bBox.update();
        if (eBox.intersectsBox(bBox)) {
          eBox.collidedWith(bBox);
          bBox.collidedWith(eBox);
        }
      });
    }); */
  }

  addHitbox(box: Hitbox) {
    if (this.debugBoxes) {
      box.helper = new Box3Helper(box);
      gameScene.add(box.helper);
    }

    this.#allHitboxes.push(box);

    if (box instanceof EntityHitbox) {
      this.#entityHitboxes.push(box);
    } else if (box instanceof BulletHitbox) {
      this.#bulletHitboxes.push(box);
    }
  }

  // Maybe add another addHitbox method that
  // creates the hitbox from scratch using
  // params?
}

// Maybe go for an enum solution rather than two sublasses of Hitbox?
/* enum HitboxType {
  ship,
  enemy,
  bullet,
} */

// Inherit intersect functions
/**
 * Just a Box3 with added features, note that the boxes
 * must be updated by the owner object
 *
 * @constructor
 * @param `owner`
 *
 */
export class Hitbox extends Box3 {
  owner: Object3D<Object3DEventMap>;
  helper: Box3Helper;
  mesh: Mesh;

  collidedNotif: (other: Hitbox) => void;

  // If using enum approach
  /*   type: HitboxType; */

  constructor(
    owner: Object3D<Object3DEventMap>,
    mesh: Mesh<
      BufferGeometry<NormalBufferAttributes>,
      Material | Material[],
      Object3DEventMap
    >
  ) {
    super();
    this.owner = owner;
    this.mesh = mesh;

    this.mesh.geometry.computeBoundingBox();
    this.copy(this.mesh.geometry.boundingBox);
  }

  collidedWith(otherBox: Hitbox) {
    if (this.collidedNotif) this.collidedNotif(otherBox);
  }

  update() {
    this.copy(this.mesh.geometry.boundingBox).applyMatrix4(
      this.mesh.matrixWorld
    );
  }

  dispose() {
    this.owner = null;
    this.mesh = null;

    if (this.helper) gameScene.remove(this.helper);

    this.helper = null;
  }
}

export class EntityHitbox extends Hitbox {
  // Maybe do stuff unique to entitties?
}

export class BulletHitbox extends Hitbox {
  // Do stuff unique to bullets?
}
