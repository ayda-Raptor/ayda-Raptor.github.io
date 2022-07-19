import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

console.log('hello!');

let fadeOut = true;

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
    camera.position.z = 5;
    camera.position.y = 2;

    const loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = () => {
        fadeInScreen();
    };

    const gltfLoader = new GLTFLoader(loadingManager);
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./draco/');
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load(
        './models/3DCard_test.glb',
        function (gltf) {
            scene.add(gltf.scene);
            gltf.scene.children[0].material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        function (error) {
            console.log('An error happened');
        }
    );

    let resizeDebounce;
    window.addEventListener(
        'resize',
        function () {
            clearTimeout(resizeDebounce);
            resizeDebounce = setTimeout(() => onWindowResize(renderer, camera), 200);
        },
        false
    );

    renderer.setAnimationLoop(() => animate(renderer, scene, camera));

    // if (fadeOut) {
    //     fadeInScreen();
    // }
}

function animate(renderer, scene, camera) {
    renderer.render(scene, camera);
}

function onWindowResize(renderer, camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    console.log('resize');
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function fadeInScreen() {
    let curtain = document.getElementById('curtain');
    curtain.classList.add('fade-in');
    curtain.classList.remove('fade-out');
}

function fadeOutScreen() {
    let curtain = document.getElementById('curtain');
    curtain.classList.add('fade-out');
    curtain.classList.remove('fade-in');
}

window.toggleFade = () => {
    if (fadeOut) {
        fadeInScreen();
        fadeOut = false;
    } else {
        fadeOutScreen();
        fadeOut = true;
    }
};
