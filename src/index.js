import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Clock, LoopOnce } from 'three';

console.log('hello!');

let animationMixer;
let clips;

const clock = new THREE.Clock();

initialise();

function initialise() {
    const scene = new THREE.Scene();
    const canvasRef = document.getElementById('three-canvas');

    document.getElementById('animButton').addEventListener('click', playCardAnimationButton);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.outputEncoding = THREE.sRGBEncoding;

    buildScene(scene, renderer);
}

function buildScene(scene, renderer) {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;
    camera.position.y = 2;

    setupWindowResize(renderer, camera);

    loadModels(scene);

    renderer.setAnimationLoop(() => animateRenderer(renderer, scene, camera));
}

function loadModels(scene) {
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = () => {
        fadeOutScreen();
    };

    const gltfLoader = new GLTFLoader(loadingManager);
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./draco/');
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load(
        './models/3DCard_test.glb',
        (gltf) => {
            scene.add(gltf.scene);
            const action = loadAnimation(gltf);
            action.play();
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.log('An error happened');
        }
    );
}

function loadAnimation(model) {
    animationMixer = new THREE.AnimationMixer(model.scene);
    clips = model.animations;

    const clip = THREE.AnimationClip.findByName(clips, 'CardBounce');
    const action = animationMixer.clipAction(clip);
    action.setLoop(LoopOnce);
    return action;
}

function animateRenderer(renderer, scene, camera) {
    const delta = clock.getDelta();
    if (animationMixer) {
        animationMixer.update(delta);
    }
    renderer.render(scene, camera);
}
function playCardAnimationButton() {
    const button = document.getElementById('animButton');
    const clip = THREE.AnimationClip.findByName(clips, 'CardBounce');
    const action = animationMixer.clipAction(clip);
    if (!action.isRunning()) {
        action.reset();
        action.play();
        button.classList.add('button-pressed');
        setTimeout(() => {
            button.classList.remove('button-pressed');
        }, 4500);
    }
}

function setupWindowResize(renderer, camera) {
    let resizeDebounce;
    window.addEventListener(
        'resize',
        function () {
            clearTimeout(resizeDebounce);
            resizeDebounce = setTimeout(() => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                console.log('resize');
                renderer.setSize(window.innerWidth, window.innerHeight);
            }, 200);
        },
        false
    );
}

function fadeOutScreen() {
    let curtain = document.getElementById('curtain');
    curtain.classList.add('fade-out');
    curtain.classList.remove('fade-in');
}

function fadeInScreen() {
    let curtain = document.getElementById('curtain');
    curtain.classList.add('fade-in');
    curtain.classList.remove('fade-out');
}
