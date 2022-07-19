import * as THREE from 'three';

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

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.animation = () => {
        cube.rotation.y += 0.01;
    };

    window.addEventListener('resize', () => onWindowResize(renderer, camera), false);

    renderer.setAnimationLoop(() => animate(renderer, scene, camera));

    if (fadeOut) {
        fadeInScreen();
    }
}

function animate(renderer, scene, camera) {
    scene.children.forEach((object) => {
        object.animation();
    });
    renderer.render(scene, camera);
}

function onWindowResize(renderer, camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function fadeInScreen() {
    let curtain = document.getElementById('curtain');
    curtain.classList.add('fade-in');
    // void curtain.offsetWidth;
    curtain.classList.remove('fade-out');
}

function fadeOutScreen() {
    let curtain = document.getElementById('curtain');
    curtain.classList.add('fade-out');
    // void curtain.offsetWidth;
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
