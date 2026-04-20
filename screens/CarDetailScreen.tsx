import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator,
  Platform, 
  Image
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

const CarDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { car } = route.params;
  const [loading, setLoading] = useState(true);

  // HTML content for 3D model viewer with TRANSPARENT background
  const create3DViewerHTML = (modelUrl) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body { 
                margin: 0; 
                overflow: hidden; 
                background-color: transparent !important;
                background: transparent !important;
            }
            #loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #F59E0B;
                background: rgba(0,0,0,0.7);
                padding: 12px 24px;
                border-radius: 30px;
                z-index: 100;
                font-family: sans-serif;
                font-size: 14px;
                white-space: nowrap;
            }
            .controls-hint {
                position: absolute;
                bottom: 15px;
                left: 50%;
                transform: translateX(-50%);
                color: rgba(255,255,255,0.7);
                background: rgba(0,0,0,0.5);
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 11px;
                pointer-events: none;
                z-index: 10;
                white-space: nowrap;
                font-family: sans-serif;
            }
            canvas {
                display: block;
                background: transparent !important;
            }
        </style>
    </head>
    <body style="background: transparent;">
        <div id="loading">🎨 Loading 3D Model...</div>
        <div class="controls-hint">🔍 Touch and drag to rotate | Pinch to zoom</div>

        <script type="importmap">
            {
                "imports": {
                    "three": "https://unpkg.com/three@0.128.0/build/three.module.js",
                    "three/addons/": "https://unpkg.com/three@0.128.0/examples/jsm/"
                }
            }
        </script>

        <script type="module">
            import * as THREE from 'three';
            import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
            import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

            // Scene with TRANSPARENT background
            const scene = new THREE.Scene();
            scene.background = null; // Transparent background
            scene.clearColor = new THREE.Color(0x000000);
            
            // Camera
            const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(2, 1.5, 3);
            camera.lookAt(0, 0, 0);

            // Renderer with transparent background
            const renderer = new THREE.WebGLRenderer({ 
                antialias: true, 
                alpha: true  // IMPORTANT: Enables transparency
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setClearColor(0x000000, 0); // Fully transparent clear color
            renderer.shadowMap.enabled = true;
            document.body.appendChild(renderer.domElement);

            // Controls
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 1.2;
            controls.enableZoom = true;
            controls.enablePan = false;
            controls.zoomSpeed = 0.8;
            controls.rotateSpeed = 1.0;
            controls.target.set(0, 0, 0);

            // Lighting - adjusted for better visibility on dark background
            const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
            scene.add(ambientLight);
            
            const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
            mainLight.position.set(2, 5, 3);
            mainLight.castShadow = true;
            mainLight.receiveShadow = true;
            scene.add(mainLight);
            
            const fillLight = new THREE.PointLight(0xF59E0B, 0.5);
            fillLight.position.set(0, -1, 0);
            scene.add(fillLight);
            
            const rimLight = new THREE.PointLight(0xffffff, 0.6);
            rimLight.position.set(-2, 1, -3);
            scene.add(rimLight);
            
            const goldLight = new THREE.PointLight(0xF59E0B, 0.6);
            goldLight.position.set(1, 1.5, 2);
            scene.add(goldLight);
            
            const backLight = new THREE.PointLight(0x88aaff, 0.4);
            backLight.position.set(0, 1, -2);
            scene.add(backLight);
            
            // Optional: Add a subtle rim light from below
            const bottomLight = new THREE.PointLight(0xF59E0B, 0.3);
            bottomLight.position.set(0, -1.5, 0);
            scene.add(bottomLight);
            
            // Load the 3D model
            const loader = new GLTFLoader();
            const modelUrl = '${modelUrl}';
            
            loader.load(modelUrl, 
                (gltf) => {
                    const model = gltf.scene;
                    
                    // Auto-scale and center the model
                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());
                    
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = 1.2 / maxDim;
                    model.scale.set(scale, scale, scale);
                    model.position.set(-center.x * scale, -center.y * scale - 0.3, -center.z * scale);
                    
                    // Enable shadows
                    model.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                            if (node.material) {
                                node.material.roughness = 0.4;
                                node.material.metalness = 0.6;
                            }
                        }
                    });
                    
                    scene.add(model);
                    
                    // Hide loading indicator
                    const loadingDiv = document.getElementById('loading');
                    if (loadingDiv) {
                        loadingDiv.style.opacity = '0';
                        setTimeout(() => {
                            loadingDiv.style.display = 'none';
                        }, 500);
                    }
                    
                    // Stop auto-rotate after user interaction
                    let userInteracted = false;
                    controls.addEventListener('start', () => {
                        if (!userInteracted) {
                            userInteracted = true;
                            controls.autoRotate = false;
                        }
                    });
                },
                (progress) => {
                    if (progress.lengthComputable) {
                        const percent = Math.round(progress.loaded / progress.total * 100);
                        const loadingDiv = document.getElementById('loading');
                        if (loadingDiv && percent < 100) {
                            loadingDiv.innerHTML = \`🎨 Loading 3D Model... \${percent}%\`;
                        }
                    }
                },
                (error) => {
                    console.error('Error loading model:', error);
                    const loadingDiv = document.getElementById('loading');
                    if (loadingDiv) {
                        loadingDiv.innerHTML = '⚠️ Failed to load model';
                        loadingDiv.style.backgroundColor = 'rgba(220, 38, 38, 0.9)';
                    }
                }
            );
            
            // Subtle particle effects (optional, adds depth without background)
            const particleCount = 300;
            const particleGeometry = new THREE.BufferGeometry();
            const particlePositions = new Float32Array(particleCount * 3);
            for (let i = 0; i < particleCount; i++) {
                particlePositions[i*3] = (Math.random() - 0.5) * 8;
                particlePositions[i*3+1] = (Math.random() - 0.5) * 5;
                particlePositions[i*3+2] = (Math.random() - 0.5) * 5 - 2;
            }
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
            const particleMaterial = new THREE.PointsMaterial({ 
                color: 0xF59E0B, 
                size: 0.02, 
                transparent: true, 
                opacity: 0.3,
                blending: THREE.AdditiveBlending
            });
            const particles = new THREE.Points(particleGeometry, particleMaterial);
            scene.add(particles);
            
            // Animation loop
            let time = 0;
            function animate() {
                requestAnimationFrame(animate);
                time += 0.01;
                
                // Gentle floating animation for particles
                particles.rotation.y = time * 0.1;
                particles.rotation.x = Math.sin(time * 0.2) * 0.1;
                
                // Pulsing light effect
                const intensity = 0.4 + Math.sin(time * 2) * 0.1;
                goldLight.intensity = intensity;
                bottomLight.intensity = 0.2 + Math.sin(time * 1.5) * 0.1;
                
                controls.update();
                renderer.render(scene, camera);
            }
            animate();
            
            // Handle window resize
            window.addEventListener('resize', onWindowResize, false);
            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
            
            // Prevent context menu on long press
            window.addEventListener('contextmenu', (e) => e.preventDefault());
        </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
         <Image source={require('../images/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{car.name}</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* 3D Model Viewer with TRANSPARENT background */}
      <View style={styles.modelContainer}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={styles.loadingText}>Loading 3D Model...</Text>
          </View>
        )}
        <WebView
          source={{ html: create3DViewerHTML(car.model3D) }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={false}
          startInLoadingState={true}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          androidHardwareAccelerationDisabled={false}
          thirdPartyCookiesEnabled={false}
          originWhitelist={['*']}
        />
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.detailText}>🎟️ Premium Quality</Text>
        <Text style={styles.detailText}>⭐ Top Rated Brand</Text>
        <Text style={styles.detailText}>💬 Easy Maintenance</Text>
        <Text style={styles.detailText}>📈 Interactive 3D Model</Text>
      </View>

      <TouchableOpacity 
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => alert('Booking feature coming soon!')}
      >
        <Text style={styles.buttonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1120",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 50,
    paddingBottom: 15,
    backgroundColor: '#0B1120',
  },
  backButton: {
    padding: 8,
    width: 50,
  },
  backText: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  modelContainer: {
    width: width - 32,
    height: 350,
    backgroundColor: 'transparent', // Changed to transparent
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent', // Transparent background
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11,17,32,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 20,
  },
  loadingText: {
    color: '#F59E0B',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '600',
  },
  detailsCard: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  detailText: {
    fontSize: 15,
    color: '#FFFFFF',
    marginVertical: 6,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#334155',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  buttonText: {
    color: '#F59E0B',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
    backIcon: {
    width: 32,
    height: 32,
   // tintColor: '#F59E0B', // Amber/Gold accent
  },
});

export default CarDetailScreen;