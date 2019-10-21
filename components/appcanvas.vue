<template>
  <canvas ref="c" style="width:100%; height:100%;" @click="createDrop" />
</template>

<script>
import { Vector3, IcosahedronBufferGeometry, Object3D, Mesh, MeshNormalMaterial, PlaneGeometry, BufferAttribute, BufferGeometry, ShaderMaterial, Scene, Color, PerspectiveCamera, Points, Clock, Matrix4, WebGLRenderer } from 'three'

export default {
  name: 'AppCanvas',
  data () {
    return {
      damping: 0.98,
      anim: null,
      w: 0,
      h: 0
    }
  },
  computed: {
    aspect () {
      return this.w / this.h
    },
    camDistance () {
      return this.w / 2 / Math.tan(30 * Math.PI / 180) * (300 / this.w) ** 1.5
    },
    camHeight () {
      return this.camDistance * (6 / 25)
    }
  },
  watch: {
    w () {
      this.updateSize()
    },
    h () {
      this.updateSize()
    }
  },
  mounted () {
    this.w = this.$refs.c.clientWidth
    this.h = this.$refs.c.clientHeight
    this.scrollDelta = 0
    this.lookAtY = 0
    this.topVector = new Vector3(0, 12, 0)
    this.spObject = (function () {
      const spGeometry = new IcosahedronBufferGeometry(9)
      const spObject = new Object3D()
      spObject.add(new Mesh(
        spGeometry,
        new MeshNormalMaterial({
          transparent: true,
          opacity: 1.0,
          depthTest: false
        })))
      spObject.position.set(0, 20, 0)
      return spObject
    }())

    this.plObject = (function () {
      const plGeometry = new PlaneGeometry(100, 100, 50, 50)
      const plVertices = plGeometry.vertices
      const plPositions = new Float32Array(plVertices.length * 3)
      for (let i = 0, l = plVertices.length; i < l; i++) {
        plVertices[i].toArray(plPositions, i * 3)
      }
      const plCloud = new BufferGeometry()
      plCloud.addAttribute('position', new BufferAttribute(plPositions, 3))
      const plPoints = new Points(plCloud, new ShaderMaterial({
        uniforms: {
          scale: {
            type: 'f',
            value: 500
          },
          opacity: {
            type: 'f',
            value: 1.0
          },
          size: {
            type: 'f',
            value: window.devicePixelRatio
          }
        },
        vertexShader:
        `varying vec3 vColor;
        const float PI = 3.1415926535897932384626433832795;
        uniform float scale;
        uniform float size;

        vec3 hsb2rgb( in vec3 c ){
          vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                       6.0)-3.0)-1.0,
                   0.0,
                   1.0 );
          rgb = rgb*rgb*(3.0-2.0*rgb);
          return c.z * mix( vec3(1.0), rgb, c.y);
        }

        void main()
        {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          if (worldPosition.y > 0.06 || worldPosition.y < -0.06) {
            float angle = atan(worldPosition.z/worldPosition.x);
            if (worldPosition.x < 0.0) {
              angle = angle + PI;
            } else if (worldPosition.x >= 0.0 && worldPosition.z <= 0.0) {
              angle = angle + 2.0*PI;
            }
            float radius = sqrt(worldPosition.x*worldPosition.x+worldPosition.z*worldPosition.z);
            vColor = hsb2rgb(vec3(angle/(2.0*PI),radius/100.0,1.0));
          } else {
            vColor = vec3(1.0,1.0,1.0);
          }
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (scale/length(mvPosition.xyz));
          gl_Position = projectionMatrix * mvPosition;
        }`,
        fragmentShader:
        `varying vec3 vColor;
        uniform float opacity;
        
        void main(void) 
        { 
          gl_FragColor = vec4(vColor, opacity);
          vec2 coord = gl_PointCoord - vec2(0.5);
          if (length(coord) > 0.5) discard;
        }`,
        depthTest: false,
        transparent: true
      }))
      const plObject = new Object3D()
      plObject.add(plPoints)
      plObject.rotation.x = -90 * Math.PI / 180
      return plObject
    }())

    this.scene = new Scene({
      background: new Color(0x000000)
    })

    this.camera = new PerspectiveCamera(50, this.aspect, 0.1, 1000)

    this.camClock = new Clock()
    this.dClock = new Clock()
    this.matrix = new Matrix4()
    this.t = 2
    this.camera.position.set(0, this.camHeight, this.camDistance)
    this.camera.lookAt(0, 0, 0)
    this.scene.add(this.plObject)
    this.scene.add(this.spObject)
    this.pArr = this.plObject.children[0].geometry.attributes.position.array
    this.prevBuffer = new Float32Array(this.pArr)
    this.len = this.pArr.length / 3
    this.zOff = Math.sqrt(this.len) * 3
    this.zxDelta = this.pArr[3] - this.pArr[0]
    this.renderer = new WebGLRenderer({
      canvas: this.$el,
      antialias: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.updateSize()
    this.animate()
  },
  beforeDestroy () {
    this.stop()
    this.renderer = null
    this.pArr = null
    this.prevBuffer = null
    this.camera = null
    this.scene = null
    this.spObject = null
    this.plObject = null
  },
  methods: {
    stop () {
      this.dClock.stop()
      this.camClock.stop()
      cancelAnimationFrame(this.anim)
      this.anim = null
    },
    start () {
      if (this.anim === null) {
        this.dClock.start()
        this.camClock.start()
        this.t = 0
        this.animate()
      }
    },
    animate () {
      if (this.dClock.getElapsedTime() > this.t) {
        this.t += 3
        this.createDrop()
      }

      this.propogate()
      this.matrix.makeRotationY((this.camClock.getDelta() + this.scrollDelta) * 2 * Math.PI / 75)
      this.camera.position.applyMatrix4(this.matrix)
      this.camera.lookAt(0, this.lookAtY, 0)
      this.spObject.rotation.x -= 0.003
      this.spObject.rotation.y += 0.005
      this.anim = requestAnimationFrame(() => this.animate())
      this.renderer.render(this.scene, this.camera)
    },
    createDrop () {
      const rand = this.getRandomInt(0, this.len)
      const pos = rand * 3 + 2
      const tmp = this.getAdjacent(pos)
      for (const key in tmp) {
        this.pArr[tmp[key]] = 50
      }
      this.pArr[pos] = 50
      this.plObject.children[0].geometry.attributes.position.needsUpdate = true
    },
    propogate () {
      for (let i = 0; i < this.len; i++) {
        const pos = i * 3 + 2
        const neighbours = this.getAdjacent(pos)
        let calc = 0
        for (const key in neighbours) {
          if (neighbours[key] != null) {
            calc += this.pArr[neighbours[key]]
          }
        }
        calc /= 2
        calc -= this.prevBuffer[pos]
        this.prevBuffer[pos] = calc * this.damping
      }

      for (let j = 2, l = this.pArr.length; j < l; j += 3) {
        const temp = this.pArr[j]
        this.pArr[j] = this.prevBuffer[j]
        this.prevBuffer[j] = temp
      }

      this.plObject.children[0].geometry.attributes.position.needsUpdate = true
    },
    getRandomInt (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    getAdjacent (yInd) {
      return {
        plsX: ((this.pArr[yInd - 2] === (this.pArr[yInd + 1] - this.zxDelta)) && (typeof this.pArr[yInd + 3] !== 'undefined')) ? yInd + 3 : null,
        mnsX: ((this.pArr[yInd - 2] === (this.pArr[yInd - 5] + this.zxDelta)) && (typeof this.pArr[yInd - 3] !== 'undefined')) ? yInd - 3 : null,
        plsZ: ((this.pArr[yInd - 1] === (this.pArr[yInd + this.zOff - 1] + this.zxDelta)) && (typeof this.pArr[yInd + this.zOff] !== 'undefined')) ? yInd + this.zOff : null,
        mnsZ: ((this.pArr[yInd - 1] === (this.pArr[yInd - this.zOff - 1] - this.zxDelta)) && (typeof this.pArr[yInd - this.zOff] !== 'undefined')) ? yInd - this.zOff : null
      }
    },
    updateSize () {
      this.camera.position.set(0, this.camHeight, this.camDistance)
      this.camera.aspect = this.aspect
      this.renderer.setSize(this.w, this.h)
      this.camera.updateProjectionMatrix()
    }
  }
}
</script>

<style>
  canvas {
    transition: width 2s ease,height 2s linear, filter 1s ease;
    -moz-transition:width 2s ease, height 2s linear;
    -webkit-transition:width 2s ease, height 2s linear;
  }
</style>
