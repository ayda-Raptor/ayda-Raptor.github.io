import * as THREE from 'three';

console.log('hello!');

initialise();

function initialise() {
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer();
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
        cube.rotation.x += 0.01;
    };

    console.log(scene.children);

    renderer.setAnimationLoop(() => animate(renderer, scene, camera));
}

function animate(renderer, scene, camera) {
    scene.children.forEach((object) => {
        object.animation();
    });
    renderer.render(scene, camera);
}
