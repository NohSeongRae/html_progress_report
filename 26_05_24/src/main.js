import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Chart from 'chart.js/auto';
import {
  AlertTriangle,
  ArrowRight,
  Bed,
  Bot,
  Braces,
  Brain,
  BrainCircuit,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Cpu,
  createIcons,
  EyeOff,
  FlaskConical,
  Gauge,
  Home,
  ImagePlus,
  ListChecks,
  Maximize2,
  MessageCircle,
  MessageSquareText,
  MousePointerClick,
  Repeat2,
  RotateCw,
  ScanSearch,
  Sofa,
  Sparkles,
  Target,
  Timer,
  UserRound,
  Waypoints,
  Workflow,
  Wrench,
  BookOpen
} from 'lucide';

createIcons({
  icons: {
    AlertTriangle,
    ArrowRight,
    Bed,
    Bot,
    Braces,
    Brain,
    BrainCircuit,
    ChefHat,
    ChevronLeft,
    ChevronRight,
    CircleHelp,
    Cpu,
    EyeOff,
    FlaskConical,
    Gauge,
    Home,
    ImagePlus,
    ListChecks,
    Maximize2,
    MessageCircle,
    MessageSquareText,
    MousePointerClick,
    Repeat2,
    RotateCw,
    ScanSearch,
    Sofa,
    Sparkles,
    Target,
    Timer,
    UserRound,
    Waypoints,
    Workflow,
    Wrench,
    BookOpen
  }
});

const slides = Array.from(document.querySelectorAll('.slide'));
const deck = document.querySelector('#deck');
const titleMini = document.querySelector('#slideTitleMini');
const counter = document.querySelector('#slideCounter');
const progressBar = document.querySelector('#progressBar');
let currentSlide = 0;
const charts = [];

const clampSlide = (index) => Math.max(0, Math.min(slides.length - 1, index));

function showSlide(index) {
  currentSlide = clampSlide(index);
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === currentSlide);
    slide.classList.toggle('before', slideIndex < currentSlide);
  });
  titleMini.textContent = slides[currentSlide].dataset.title;
  counter.textContent = `${currentSlide + 1} / ${slides.length}`;
  progressBar.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
  window.location.hash = `slide-${currentSlide + 1}`;
  requestAnimationFrame(() => charts.forEach((chart) => chart.resize()));
}

function updateDeckScale() {
  const marginX = 72;
  const marginY = 80;
  const scale = Math.min(
    (window.innerWidth - marginX) / 1600,
    (window.innerHeight - marginY) / 900,
    1
  );
  deck.style.setProperty('--deck-scale', Math.max(0.12, scale).toFixed(4));
}

document.querySelector('#prevSlide').addEventListener('click', () => showSlide(currentSlide - 1));
document.querySelector('#nextSlide').addEventListener('click', () => showSlide(currentSlide + 1));
document.querySelector('#homeSlide').addEventListener('click', () => showSlide(0));
document.querySelector('#fullscreen').addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
});

window.addEventListener('keydown', (event) => {
  const nextKeys = ['ArrowRight', 'PageDown', ' '];
  const prevKeys = ['ArrowLeft', 'PageUp'];
  if (nextKeys.includes(event.key)) {
    event.preventDefault();
    showSlide(currentSlide + 1);
  }
  if (prevKeys.includes(event.key)) {
    event.preventDefault();
    showSlide(currentSlide - 1);
  }
  if (event.key === 'Home') showSlide(0);
  if (event.key === 'End') showSlide(slides.length - 1);
});

window.addEventListener('resize', updateDeckScale);
updateDeckScale();

const hashSlide = Number.parseInt(window.location.hash.replace('#slide-', ''), 10);
if (Number.isFinite(hashSlide)) showSlide(hashSlide - 1);
else showSlide(0);

function resizeRenderer(renderer, camera) {
  const canvas = renderer.domElement;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.floor(canvas.clientWidth * pixelRatio));
  const height = Math.max(1, Math.floor(canvas.clientHeight * pixelRatio));
  if (canvas.width !== width || canvas.height !== height) {
    renderer.setSize(width / pixelRatio, height / pixelRatio, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

function makeBox(width, height, depth, color, roughness = 0.75) {
  return new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({ color, roughness })
  );
}

function setupIndoorScene() {
  const canvas = document.querySelector('#indoorSceneCanvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = null;
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(6.5, 5.2, 7.2);
  camera.lookAt(0, 0.5, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xcbd5e1, 2.1));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
  keyLight.position.set(4, 6, 5);
  scene.add(keyLight);

  const room = new THREE.Group();
  const floor = makeBox(7.2, 0.08, 5.2, 0xeef2f7);
  floor.position.y = -0.04;
  room.add(floor);

  const backWall = makeBox(7.2, 2.8, 0.08, 0xf8fafc);
  backWall.position.set(0, 1.36, -2.62);
  room.add(backWall);

  const sideWall = makeBox(0.08, 2.8, 5.2, 0xe0f2fe);
  sideWall.position.set(-3.64, 1.36, 0);
  room.add(sideWall);

  const rug = makeBox(3.4, 0.035, 2.1, 0xf97316, 0.9);
  rug.position.set(-0.5, 0.01, 0.35);
  room.add(rug);

  const couch = new THREE.Group();
  couch.add(makeBox(2.25, 0.45, 0.75, 0x155e75));
  const couchBack = makeBox(2.35, 0.75, 0.2, 0x0e7490);
  couchBack.position.set(0, 0.35, -0.38);
  couch.add(couchBack);
  const leftArm = makeBox(0.18, 0.55, 0.8, 0x0891b2);
  leftArm.position.set(-1.18, 0.12, 0);
  couch.add(leftArm);
  const rightArm = leftArm.clone();
  rightArm.position.x = 1.18;
  couch.add(rightArm);
  couch.position.set(-0.8, 0.28, -1.55);
  room.add(couch);

  const table = makeBox(1.2, 0.22, 0.82, 0xfbbf24);
  table.position.set(0.1, 0.17, 0.05);
  room.add(table);

  const shelf = new THREE.Group();
  shelf.add(makeBox(0.85, 1.45, 0.28, 0x334155));
  for (let i = 0; i < 4; i += 1) {
    const row = makeBox(0.72, 0.06, 0.32, 0x94a3b8);
    row.position.set(0, -0.54 + i * 0.34, 0.01);
    shelf.add(row);
  }
  const bookColors = [0xef4444, 0x22c55e, 0x3b82f6, 0xf59e0b, 0xa855f7];
  for (let i = 0; i < 12; i += 1) {
    const book = makeBox(0.08, 0.28 + (i % 3) * 0.04, 0.08, bookColors[i % bookColors.length]);
    book.position.set(-0.3 + (i % 6) * 0.11, -0.38 + Math.floor(i / 6) * 0.68, 0.19);
    shelf.add(book);
  }
  shelf.position.set(2.85, 0.72, -2.18);
  room.add(shelf);

  const lamp = new THREE.Group();
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 1.25, 18),
    new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.55 })
  );
  pole.position.y = 0.64;
  lamp.add(pole);
  const shade = new THREE.Mesh(
    new THREE.ConeGeometry(0.32, 0.42, 24, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.45, side: THREE.DoubleSide })
  );
  shade.position.y = 1.28;
  lamp.add(shade);
  lamp.position.set(-2.65, 0, -1.85);
  room.add(lamp);

  const user = new THREE.Group();
  const userBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.23, 0.31, 0.85, 24),
    new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.55 })
  );
  userBody.position.y = 0.48;
  user.add(userBody);
  const userHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 28, 20),
    new THREE.MeshStandardMaterial({ color: 0xf8c7a5, roughness: 0.5 })
  );
  userHead.position.y = 1.08;
  user.add(userHead);
  user.position.set(-2.25, 0, 1.35);
  room.add(user);

  const agent = new THREE.Group();
  const agentCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.38, 1),
    new THREE.MeshStandardMaterial({ color: 0x14b8a6, emissive: 0x0f766e, emissiveIntensity: 0.28, roughness: 0.42 })
  );
  agent.add(agentCore);
  const ringA = new THREE.Mesh(
    new THREE.TorusGeometry(0.54, 0.018, 12, 80),
    new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x075985, emissiveIntensity: 0.3 })
  );
  agent.add(ringA);
  const ringB = ringA.clone();
  ringB.rotation.x = Math.PI / 2;
  agent.add(ringB);
  agent.position.set(2.1, 1.55, 1.05);
  room.add(agent);

  const mcts = new THREE.Group();
  const nodeMaterial = new THREE.MeshStandardMaterial({ color: 0xff7a59, emissive: 0x9a3412, emissiveIntensity: 0.25 });
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.6 });
  const nodePositions = [
    new THREE.Vector3(1.1, 1.0, 0.4),
    new THREE.Vector3(1.6, 0.75, -0.35),
    new THREE.Vector3(2.3, 0.82, -0.7),
    new THREE.Vector3(2.75, 0.74, 0.0),
    new THREE.Vector3(3.0, 0.58, 0.75)
  ];
  nodePositions.forEach((position, index) => {
    const node = new THREE.Mesh(new THREE.SphereGeometry(0.105 + index * 0.008, 18, 14), nodeMaterial);
    node.position.copy(position);
    mcts.add(node);

    const from = index === 0 ? new THREE.Vector3(2.1, 1.55, 1.05) : nodePositions[index - 1];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([from, position]);
    mcts.add(new THREE.Line(lineGeometry, lineMaterial));
  });
  room.add(mcts);

  const candidateA = makeBox(0.95, 0.08, 0.68, 0x22c55e);
  candidateA.position.set(2.25, 0.08, 1.85);
  room.add(candidateA);
  const candidateB = makeBox(0.95, 0.08, 0.68, 0xf43f5e);
  candidateB.position.set(3.3, 0.08, 1.85);
  room.add(candidateB);

  scene.add(room);

  function animate(time = 0) {
    resizeRenderer(renderer, camera);
    agent.rotation.y = time * 0.0012;
    agent.rotation.z = Math.sin(time * 0.001) * 0.15;
    mcts.children.forEach((child, index) => {
      if (child.isMesh) {
        const pulse = 1 + Math.sin(time * 0.004 + index) * 0.1;
        child.scale.setScalar(pulse);
      }
    });
    room.rotation.y = Math.sin(time * 0.00035) * 0.06;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

function setupRubikScene() {
  const canvas = document.querySelector('#rubikCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(4.8, 4.2, 6.2);
  camera.lookAt(0, 0, 0);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 4.2;
  controls.maxDistance = 8.4;
  controls.rotateSpeed = 0.72;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x94a3b8, 2.4));
  const light = new THREE.DirectionalLight(0xffffff, 2.1);
  light.position.set(3, 5, 4);
  scene.add(light);

  const cubeGroup = new THREE.Group();
  const stickerColors = {
    red: 0xef4444,
    green: 0x22c55e,
    white: 0xf8fafc,
    yellow: 0xfacc15,
    blue: 0x3b82f6,
    orange: 0xf97316,
    hidden: 0x0f172a
  };
  const stickerSequence = [
    ...Array(10).fill('red'),
    ...Array(8).fill('green'),
    ...Array(9).fill('white'),
    ...Array(9).fill('yellow'),
    ...Array(9).fill('blue'),
    ...Array(9).fill('orange')
  ];
  const shuffleOrder = [
    17, 3, 42, 8, 25, 50, 11, 36, 1, 47, 20, 31, 6, 53, 14, 39, 28, 4,
    45, 22, 9, 33, 51, 16, 0, 41, 27, 12, 49, 35, 7, 24, 52, 18, 30, 2,
    44, 21, 10, 37, 29, 5, 48, 15, 40, 26, 13, 34, 46, 19, 32, 23, 43, 38
  ];
  const shuffledStickers = shuffleOrder.map((index) => stickerSequence[index]);
  window.__cubeColorCounts = shuffledStickers.reduce((counts, color) => {
    counts[color] = (counts[color] || 0) + 1;
    return counts;
  }, {});
  let stickerIndex = 0;
  const nextSticker = () => stickerColors[shuffledStickers[stickerIndex++]];
  const hiddenMaterial = new THREE.MeshStandardMaterial({ color: stickerColors.hidden, roughness: 0.62 });

  for (let x = -1; x <= 1; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      for (let z = -1; z <= 1; z += 1) {
        const materials = [
          x === 1 ? new THREE.MeshStandardMaterial({ color: nextSticker(), roughness: 0.54 }) : hiddenMaterial,
          x === -1 ? new THREE.MeshStandardMaterial({ color: nextSticker(), roughness: 0.54 }) : hiddenMaterial,
          y === 1 ? new THREE.MeshStandardMaterial({ color: nextSticker(), roughness: 0.54 }) : hiddenMaterial,
          y === -1 ? new THREE.MeshStandardMaterial({ color: nextSticker(), roughness: 0.54 }) : hiddenMaterial,
          z === 1 ? new THREE.MeshStandardMaterial({ color: nextSticker(), roughness: 0.54 }) : hiddenMaterial,
          z === -1 ? new THREE.MeshStandardMaterial({ color: nextSticker(), roughness: 0.54 }) : hiddenMaterial
        ];
        const cubie = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.72, 0.72), materials);
        cubie.position.set(x * 0.82, y * 0.82, z * 0.82);
        cubeGroup.add(cubie);
      }
    }
  }
  cubeGroup.rotation.set(-0.42, 0.72, 0.16);
  scene.add(cubeGroup);

  const memoryArc = new THREE.Mesh(
    new THREE.TorusGeometry(2.05, 0.018, 12, 120, Math.PI * 1.55),
    new THREE.MeshStandardMaterial({ color: 0x14b8a6, emissive: 0x0f766e, emissiveIntensity: 0.3 })
  );
  memoryArc.rotation.set(Math.PI / 2.35, 0.05, -0.28);
  scene.add(memoryArc);

  const viewPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.5, 2.5),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.08, side: THREE.DoubleSide })
  );
  viewPlane.position.set(-0.3, 0.2, 1.6);
  viewPlane.rotation.set(-0.5, 0.1, 0);
  scene.add(viewPlane);

  function animate(time = 0) {
    resizeRenderer(renderer, camera);
    controls.update();
    memoryArc.rotation.z = -0.28 + time * 0.0004;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

function setupCharts() {
  const labelColor = '#334155';
  const gridColor = 'rgba(100, 116, 139, 0.18)';

  const bmvcProgressCanvas = document.querySelector('#bmvcProgressChart');
  if (bmvcProgressCanvas) {
    charts.push(new Chart(bmvcProgressCanvas, {
    type: 'doughnut',
    data: {
      labels: ['완료', '진행중', '예정'],
      datasets: [{
        data: [3, 2, 2],
        backgroundColor: ['#14b8a6', '#f97316', '#cbd5e1'],
        borderColor: '#ffffff',
        borderWidth: 5,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: labelColor, boxWidth: 12, usePointStyle: true, pointStyle: 'circle' }
        },
        tooltip: { enabled: true }
      }
    }
    }));
  }

  charts.push(new Chart(document.querySelector('#occlusionChart'), {
    type: 'bar',
    data: {
      labels: ['Direct LVLM', 'Code synth', 'Inpaint + KP'],
      datasets: [{
        label: 'Occluded robustness 가설',
        data: [48, 44, 72],
        backgroundColor: ['#ef4444', '#f97316', '#14b8a6'],
        borderRadius: 7,
        maxBarThickness: 36
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: { color: labelColor, callback: (value) => `${value}` },
          grid: { color: gridColor }
        },
        x: {
          ticks: { color: labelColor, maxRotation: 0 },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            afterLabel: () => '실험 결과가 아니라 현재 working hypothesis'
          }
        }
      }
    }
  }));
}

setupIndoorScene();
setupRubikScene();
setupCharts();
