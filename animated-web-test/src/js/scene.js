import * as THREE from 'three';
export function createScene() {
    const app = document.querySelector('#app');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.set(0, 1.5, 5);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );
    renderer.setClearColor(0x000000, 0);
    app.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);
    const directionalLight =
        new THREE.DirectionalLight(0xffffff, 3);

    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    window.addEventListener('resize', () => {
        camera.aspect =
            window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    });
    return {
        scene,
        camera,
        renderer
    };
}