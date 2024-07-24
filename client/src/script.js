import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'
import { MeshStandardMaterial } from 'three';
import { DragControls } from 'three/addons/controls/DragControls.js';
/**
 * Debug
 */


const gui = new GUI({
  width: 300,
  title: 'Nice debug UI',
  closeFolders: false
})
// gui.close()
// gui.hide()
window.addEventListener('keydown', (event) => {
  if (event.key == 'h')
    gui.show(gui._hidden)
})

const debugObject = {}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// AXIS HELPER
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


// Light

const light = new THREE.AmbientLight(0x404040, 20);
scene.add(light);



/**
 * Object
 */
debugObject.color = '#a778d8'

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: '#a778d8', wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
//scene.add(mesh)

const cubeTweaks = gui.addFolder('Awesome cube')
// cubeTweaks.close()

cubeTweaks
  .add(mesh.position, 'y')
  .min(- 3)
  .max(3)
  .step(0.01)
  .name('elevation')

cubeTweaks
  .add(mesh, 'visible')

cubeTweaks
  .add(material, 'wireframe')

cubeTweaks
  .addColor(debugObject, 'color')
  .onChange(() => {
    material.color.set(debugObject.color)
  })

debugObject.spin = () => {
  gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
}
cubeTweaks
  .add(debugObject, 'spin')

debugObject.subdivision = 2
cubeTweaks
  .add(debugObject, 'subdivision')
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    mesh.geometry.dispose()
    mesh.geometry = new THREE.BoxGeometry(
      1, 1, 1,
      debugObject.subdivision, debugObject.subdivision, debugObject.subdivision
    )
  })

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 5000)
camera.position.x = 500
camera.position.y = 1
camera.position.z = 500
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

export function updateNode(node) {
  node.updateMatrixWorld
  console.log("at script")
}


export function addToScene(object) {
  console.log("hello", object.scene)
  if (object.type === 'stl') {
    const material = new THREE.MeshBasicMaterial({ color: '#a778d8', wireframe: true });
    let mesh = new THREE.Mesh(object.scene, material);
    mesh.position.set(0, 20, 0);
    scene.add(mesh);
    object.scene = mesh
    object.type = "three"
  } else {
    addGroup(object.scene, scene);
  }
}


function addGroup(object, parent) {
  let group = new THREE.Group()
  object.children.forEach((child) => {
    if (child.isMesh) {
      addMesh(child, group);
    } else {
      addGroup(child, group);
    }

  });

  parent.add(group)
}

function addMesh(object) {


  if (object && object.isMesh) {
    const worldPosition = new THREE.Vector3();
    const worldRotation = new THREE.Quaternion();
    const worldScale = new THREE.Vector3();

    object.updateMatrixWorld(true);
    object.getWorldPosition(worldPosition);
    object.getWorldQuaternion(worldRotation);
    object.getWorldScale(worldScale);

    const newMesh = new THREE.Mesh(object.geometry, object.material);
    newMesh.position.copy(worldPosition);
    newMesh.quaternion.copy(worldRotation);
    newMesh.scale.copy(worldScale);

    scene.add(newMesh);
  }
}

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
