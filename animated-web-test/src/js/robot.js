import * as THREE from 'three';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadRobot(scene) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            '/models/robot.glb',
            (gltf) => {
                const robot = gltf.scene;
                robot.scale.set(1, 1, 1);
                scene.add(robot);
                const mixer = new THREE.AnimationMixer(robot);
                const sittingClip =
                    gltf.animations.find(clip => clip.name === 'Sitting');
                const waveClip =
                    gltf.animations.find(clip => clip.name === 'Look_Wave');
                let sittingAction = null;
                let waveAction = null;
                if (waveClip) {
                    waveAction = mixer.clipAction(waveClip);
                    waveAction.setLoop(
                        THREE.LoopRepeat
                    );
                    waveAction.play();
                }
                if (sittingClip) {
                    sittingAction = mixer.clipAction(sittingClip);
                    sittingAction.setLoop(
                        THREE.LoopRepeat
                    );
                }
                function playWaveAnimation() {
                    if (!waveAction) return;
                    if (sittingAction) {
                        waveAction.reset();
                        waveAction.play();
                        sittingAction.crossFadeTo(
                            waveAction,
                            0.5,
                            true
                        );
                    } else {
                        waveAction.reset().play();
                    }
                }
                function playSittingAnimation() {
                    if (!sittingAction) return;
                    if (waveAction) {
                        sittingAction.reset();
                        sittingAction.play();
                        waveAction.crossFadeTo(
                            sittingAction,
                            0.5,
                            true
                        );
                    } else {
                        sittingAction.reset().play();
                    }
                }
                console.log(
                    'Robot loaded:',
                    robot
                );
                console.log(
                    'Animation names:',
                    gltf.animations.map(
                        clip => clip.name
                    )
                );
                resolve({
                    robot,
                    mixer,
                    playWaveAnimation,
                    playSittingAnimation
                });
            },
            (progress) => {
                if (progress.total > 0) {
                    console.log(
                        'Loading:',
                        (
                            progress.loaded /
                            progress.total *
                            100
                        ).toFixed(2),
                        '%'
                    );
                }
            },
            (error) => {
                console.error(
                    'Error loading robot:',
                    error
                );
                reject(error);
            }
        );
    });
}