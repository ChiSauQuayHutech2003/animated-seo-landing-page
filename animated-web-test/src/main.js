import * as THREE from 'three';
import './style.css';
import {
    createScene
} from './js/scene.js';
import {
    loadRobot
} from './js/robot.js';
import {
    setupRobotScroll
} from './js/robotScroll.js';
async function init() {
    const {
        scene,
        camera,
        renderer
    } = createScene();
    const {
        robot,
        mixer,
        playWaveAnimation,
        playSittingAnimation
    } = await loadRobot(scene);
    setupRobotScroll({
        robot,
        camera,
        playWaveAnimation,
        playSittingAnimation
    });
    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener(
        'mousemove',
        (event) => {
            mouseX =
                (
                    event.clientX /
                    window.innerWidth
                ) * 2 - 1;
            mouseY =
                (
                    event.clientY /
                    window.innerHeight
                ) * 2 - 1;
        }
    );
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(
            animate
        );
        const delta = clock.getDelta();
        mixer.update(delta);
        robot.rotation.y =
            THREE.MathUtils.lerp(
                robot.rotation.y,
                mouseX * 0.4,
                0.06
            );
        robot.rotation.x =
            THREE.MathUtils.lerp(
                robot.rotation.x,
                -mouseY * 0.08,
                0.06
            );
        renderer.render(
            scene,
            camera
        );
    }
    animate();
}
init().catch((error) => {
    console.error(
        'Application initialization failed:',
        error
    );
});