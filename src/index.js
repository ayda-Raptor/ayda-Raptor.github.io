import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

console.log('hello!');

initialise();

function initialise() {
    const scene = new THREE.Scene();
    const canvasRef = document.getElementById('three-canvas');

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    buildScene(scene, renderer);
}

function buildScene(scene, renderer) {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;
    camera.position.y = 2;

    loadModels(scene);

    setupWindowResize(renderer, camera);

    renderer.setAnimationLoop(() => animate(renderer, scene, camera));
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
            gltf.scene.children[0].material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.log('An error happened');
        }
    );
}

function animate(renderer, scene, camera) {
    renderer.render(scene, camera);
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
