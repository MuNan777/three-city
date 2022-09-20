import { CubeTextureLoader, Scene } from "three";

// 创建一个场景
const scene = new Scene()

// 添加背景
const textureCubeLoader = new CubeTextureLoader().setPath("./textures/");
const textureCube = textureCubeLoader.load([
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
]);

scene.background = textureCube;
scene.environment = textureCube;

export default scene