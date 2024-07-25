import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'
import { MeshStandardMaterial } from 'three';
import { DragControls } from 'three/addons/controls/DragControls.js';
/**
 * Debug
 */


const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff);

// AXIS HELPER
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


// Light

const light = new THREE.AmbientLight(0x404040, 20);
scene.add(light);

// Environment

const environmentMap = cubeTextureLoader.load([
  '/environmentMaps/0/px.png',
  '/environmentMaps/0/nx.png',
  '/environmentMaps/0/py.png',
  '/environmentMaps/0/ny.png',
  '/environmentMaps/0/pz.png',
  '/environmentMaps/0/nz.png'
])

scene.environment = environmentMap



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


// REACT INTERACTIONS

export function returnScene() {
  return scene
}

export function addToScene(object) {
  addGroup(object.scene, scene);
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


function addMesh(object, group) {


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

    newMesh.name = "no name"
    if (object.name !== "") newMesh.name = object.name

    group.add(newMesh);
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
