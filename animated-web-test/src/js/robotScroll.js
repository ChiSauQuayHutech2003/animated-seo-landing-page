import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ROBOT_Z = 0;

export function setupRobotScroll({
    robot,
    camera,
    playWaveAnimation,
    playSittingAnimation
}) {
    let heroRobotPosition = null;

    // =========================
    // DOM FRAME -> THREE WORLD
    // =========================
    function getFrameWorldPosition(frameName) {

        const frame = document.querySelector(
            `[data-robot-frame="${frameName}"]`
        );

        if (!frame) {
            console.warn(
                `Không tìm thấy frame: ${frameName}`
            );
            return null;
        }

        const rect = frame.getBoundingClientRect();

        // Tâm của frame trên màn hình
        const screenX =
            rect.left + rect.width / 2;

        const screenY =
            rect.top + rect.height / 2;

        // Pixel -> NDC
        const ndcX =
            (screenX / window.innerWidth) * 2 - 1;

        const ndcY =
            -(screenY / window.innerHeight) * 2 + 1;

        const vector = new THREE.Vector3(
            ndcX,
            ndcY,
            0
        );

        vector.unproject(camera);

        const direction = vector
            .sub(camera.position)
            .normalize();

        const distance =
            (ROBOT_Z - camera.position.z) /
            direction.z;

        return camera.position
            .clone()
            .add(
                direction.multiplyScalar(distance)
            );
    }


    // =========================
    // HERO
    // =========================
    function setHeroPosition() {

        const heroPosition =
            getFrameWorldPosition('hero');

        if (!heroPosition) {
            return;
        }

        heroRobotPosition =
            heroPosition.clone();

        robot.position.copy(
            heroRobotPosition
        );
    }


    setHeroPosition();


    // =========================
    // VIDEO SECTION
    // =========================
    const videoSection =
        document.querySelector('.video-section');

    if (!videoSection) {
        console.warn(
            'Không tìm thấy .video-section'
        );
        return;
    }


    // =========================
    // SCROLL
    // =========================
    const scrollTrigger =
        ScrollTrigger.create({

            trigger: videoSection,

            start: 'top bottom',
            end: 'top 45%',

            scrub: true,


            onUpdate: (self) => {

                if (!heroRobotPosition) {
                    return;
                }

                const videoPosition =
                    getFrameWorldPosition('video');

                if (!videoPosition) {
                    return;
                }


                robot.position.x =
                    THREE.MathUtils.lerp(
                        heroRobotPosition.x,
                        videoPosition.x,
                        self.progress
                    );


                robot.position.y =
                    THREE.MathUtils.lerp(
                        heroRobotPosition.y,
                        videoPosition.y,
                        self.progress
                    );


                robot.position.z =
                    ROBOT_Z;
            },


            // Robot đã tới Video
            onLeave: () => {

                const videoPosition =
                    getFrameWorldPosition('video');

                if (videoPosition) {
                    robot.position.copy(
                        videoPosition
                    );
                }

                console.log(
                    'Robot tới Video → Sitting'
                );

                playSittingAnimation();
            },


            // Cuộn ngược lên
            onEnterBack: () => {

                console.log(
                    'Video → Hero'
                );
            },


            // Robot đã trở về Hero
            onLeaveBack: () => {

                if (heroRobotPosition) {
                    robot.position.copy(
                        heroRobotPosition
                    );
                }

                console.log(
                    'Robot về Hero → Look_Wave'
                );

                playWaveAnimation();
            }
        });


    // =========================
    // RESIZE
    // =========================
    window.addEventListener(
        'resize',
        () => {

            const newHeroPosition =
                getFrameWorldPosition('hero');

            if (newHeroPosition) {

                heroRobotPosition =
                    newHeroPosition.clone();

                // Nếu đang ở Hero
                if (scrollTrigger.progress === 0) {

                    robot.position.copy(
                        heroRobotPosition
                    );
                }
            }

            ScrollTrigger.refresh();
        }
    );


    ScrollTrigger.refresh();
}