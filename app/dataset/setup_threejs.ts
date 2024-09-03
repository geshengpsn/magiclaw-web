import { AxesHelper, Color, DirectionalLight, GridHelper, PerspectiveCamera, Scene, Vector3, WebGLRenderer, PCFSoftShadowMap } from 'three';
import theme from 'daisyui/src/theming/themes';

export interface Renderer {
    camera: PerspectiveCamera;
    canvas: HTMLCanvasElement;
    renderer: WebGLRenderer;
    scene: Scene;
}

export function setup_threejs(canvas: HTMLCanvasElement, width: number, height: number): Renderer {
    // renderer
    const renderer = new WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: false,
    })
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    // https://discourse.threejs.org/t/getprograminfolog-performance-issue/41069
    // for performance
    renderer.debug.checkShaderErrors = false;

    // scene
    const scene = new Scene();
    scene.background = new Color(0x24283b);
    // scene.fog = new Fog(0xa0a0a0, 10, 500);

    // camera
    const camera = new PerspectiveCamera(45, height / height, 0.001, 1000);
    camera.position.set(1, 1, 1);
    camera.lookAt(new Vector3(0, 0, 0));

    // control


    // light
    // const hemiLight = new HemisphereLight(0xffffff, 0x8d8d8d, 3);
    // hemiLight.position.set(0, 100, 0);
    // scene.add(hemiLight);

    const dirLight = new DirectionalLight(0xffffff, 3);
    dirLight.position.set(- 0, 40, 50);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = - 25;
    dirLight.shadow.camera.left = - 25;
    dirLight.shadow.camera.right = 25;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.set(1024, 1024);
    scene.add(dirLight);

    // ground
    // const ground = new Mesh(new PlaneGeometry(1000, 1000), new MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }));
    // ground.rotation.x = - Math.PI / 2;
    // ground.position.y = 0;
    // ground.receiveShadow = true;
    // scene.add(ground);

    // helper
    // const axesHelper = new AxesHelper(1);
    // scene.add(axesHelper);
    const gridHelper = new GridHelper(2, 20, 0x888888, 0x444444);
    scene.add(gridHelper);

    // render loop
    const render = function () {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    const onWindowResize = function () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
    window.addEventListener('resize', onWindowResize);
    render()
    return { scene, camera, renderer, canvas };
}