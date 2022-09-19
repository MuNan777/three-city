import * as THREE from 'three'
import gsap from 'gsap'

const cityMaterial = new THREE.MeshBasicMaterial({
  color: 0x00000
})

const vParamsArr: string[] = []
const vMainArr: string[] = []

const fParamsArr: string[] = []
const fMainArr: string[] = []

export default function modifyCityMaterial(item: THREE.Object3D<THREE.Event>) {
  const mesh = item as THREE.Mesh
  cityMaterial.onBeforeCompile = (shader) => {
    // 添加整体颜色渐变
    addGradColor(mesh, shader)
    addSpread(shader)
    shader.vertexShader = getVertexShader()
    shader.fragmentShader = getFragmentShader()
  }
  mesh.material = cityMaterial
}

// 利用高度差设置颜色渐变
function addGradColor(mesh: THREE.Mesh, shader: THREE.Shader) {
  const { max, min } = mesh.geometry.boundingBox! // 外边距矩形
  // 获取物体高度差
  let height = max.y - min.y
  shader.uniforms.uHeight = {
    value: height // 整体高度差
  }
  shader.uniforms.uTopColor = {
    value: new THREE.Color(0x0c00c0) // 顶部颜色
  }
  // 顶点着色器
  // 传递
  vParamsArr.push('varying vec3 vPosition;')
  vMainArr.push('vPosition = position;')
  fParamsArr.push(`
    varying vec3 vPosition;
    uniform float uHeight;
    uniform vec3 uTopColor;
  `)
  fMainArr.push(`
    // 获取底色
    vec4 distGradColor = gl_FragColor;
    // 设置混合的百分比，+ uHeight / 2.0，保证地面不会过暗
    float gradMix = (vPosition.y + uHeight / 2.0) / uHeight;
    // 计算出混合颜色
    vec3 gradMixColor = mix(distGradColor.xyz, uTopColor, gradMix);
    // 设置混合色
    gl_FragColor = vec4(gradMixColor, 1.0);
  `)
}

// 添加建筑材质光波扩散特效
export function addSpread(shader: THREE.Shader, center = new THREE.Vector2(0, 0)) {
  // 设置扩散的中心点
  shader.uniforms.uSpreadCenter = { value: center }
  // 扩散时间
  shader.uniforms.uSpreadTime = { value: 0 }
  // 设置条带宽度
  shader.uniforms.uSpreadWidth = { value: 40 }

  fParamsArr.push(`
    uniform vec2 uSpreadCenter;
    uniform float uSpreadTime;
    uniform float uSpreadWidth;
  `)
  fMainArr.push(`
    // 当前扩散半径，所在位置点到中心距离
    float spreadRadius = distance(vPosition.xz, uSpreadCenter);
    // 扩散范围函数
    // -x^2 + b , 所在位置点减去增加的时间的平方负数，加上 b 大于 0 的区域，进行颜色混合
    float spreadIndex = -(spreadRadius - uSpreadTime) * (spreadRadius - uSpreadTime) + uSpreadWidth;
    if (spreadIndex > 0.0) {
      gl_FragColor = mix(gl_FragColor, vec4(1.0, 1.0, 0.0, 1.0), spreadIndex / uSpreadWidth);
    }
  `)
  gsap.to(shader.uniforms.uSpreadTime, {
    value: 200,
    duration: 2,
    ease: 'none',
    repeat: -1
  })
}


function getVertexShader() {
  return `
  #include <common>
  #include <uv_pars_vertex>
  #include <uv2_pars_vertex>
  #include <envmap_pars_vertex>
  #include <color_pars_vertex>
  #include <fog_pars_vertex>
  #include <morphtarget_pars_vertex>
  #include <skinning_pars_vertex>
  #include <logdepthbuf_pars_vertex>
  #include <clipping_planes_pars_vertex>
  ${vParamsArr.join('')}
  void main() {
    #include <uv_vertex>
    #include <uv2_vertex>
    #include <color_vertex>
    #include <morphcolor_vertex>
    #if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
      #include <beginnormal_vertex>
      #include <morphnormal_vertex>
      #include <skinbase_vertex>
      #include <skinnormal_vertex>
      #include <defaultnormal_vertex>
    #endif
    #include <begin_vertex>
    #include <morphtarget_vertex>
    #include <skinning_vertex>
    #include <project_vertex>
    #include <logdepthbuf_vertex>
    #include <clipping_planes_vertex>
    #include <worldpos_vertex>
    #include <envmap_vertex>
    #include <fog_vertex>
    ${vMainArr.join('')}
  }
  `
}
function getFragmentShader() {
  return `
  uniform vec3 diffuse;
  uniform float opacity;
  #ifndef FLAT_SHADED
    varying vec3 vNormal;
  #endif
  #include <common>
  #include <dithering_pars_fragment>
  #include <color_pars_fragment>
  #include <uv_pars_fragment>
  #include <uv2_pars_fragment>
  #include <map_pars_fragment>
  #include <alphamap_pars_fragment>
  #include <alphatest_pars_fragment>
  #include <aomap_pars_fragment>
  #include <lightmap_pars_fragment>
  #include <envmap_common_pars_fragment>
  #include <envmap_pars_fragment>
  #include <fog_pars_fragment>
  #include <specularmap_pars_fragment>
  #include <logdepthbuf_pars_fragment>
  #include <clipping_planes_pars_fragment>
  ${fParamsArr.join('')}
  void main() {
    #include <clipping_planes_fragment>
    vec4 diffuseColor = vec4( diffuse, opacity );
    #include <logdepthbuf_fragment>
    #include <map_fragment>
    #include <color_fragment>
    #include <alphamap_fragment>
    #include <alphatest_fragment>
    #include <specularmap_fragment>
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    #ifdef USE_LIGHTMAP
      vec4 lightMapTexel = texture2D( lightMap, vUv2 );
      reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
    #else
      reflectedLight.indirectDiffuse += vec3( 1.0 );
    #endif
    #include <aomap_fragment>
    reflectedLight.indirectDiffuse *= diffuseColor.rgb;
    vec3 outgoingLight = reflectedLight.indirectDiffuse;
    #include <envmap_fragment>
    #include <output_fragment>
    #include <tonemapping_fragment>
    #include <encodings_fragment>
    #include <fog_fragment>
    #include <premultiplied_alpha_fragment>
    #include <dithering_fragment>
    ${fMainArr.join('')}
  }
  `
}