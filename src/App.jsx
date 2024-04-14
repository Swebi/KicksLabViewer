import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  ContactShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { proxy, useSnapshot } from "valtio";
import { HexColorPicker } from "react-colorful";
import { IoLogoGithub } from "react-icons/io";

const state = proxy({
  current: null,
  items: {
    laces: "#fff",
    mesh: "#fff",
    caps: "#fff",
    inner: "#fff",
    sole: "#fff",
    stripes: "#fff",
    band: "#fff",
    patch: "#fff",
  },
}); // Valtio State Management

function Shoe(props) {
  const snap = useSnapshot(state); // to use the state in the shoe
  const ref = useRef();

  const [hovered, setHovered] = useState(null);

  const { nodes, materials } = useGLTF("shoe-draco.glb");

  useEffect(() => {
    // Custom SVG, cursor has the color of the hovered from our state
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="#fff-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`;
    const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`;
    if (hovered) {
      document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
        cursor
      )}'), auto`;
      return () =>
        (document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
          auto
        )}'), auto`);
    }
  }, [hovered]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.set(
      Math.cos(t / 4) / 8,
      Math.sin(t / 4) / 8,
      -0.2 - (1 + Math.sin(t / 1.5)) / 20
    );
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10;
  });

  return (
    <group
      ref={ref}
      {...props}
      dispose={null}
      // hover
      onPointerOver={(e) => {
        e.stopPropagation(), setHovered(e.object.material.name);
      }} // these are for events on the shoe
      onPointerOut={(e) => {
        e.intersections.length === 0 && setHovered(null);
      }} // check if still on object
      //clicks
      onPointerDown={(e) => {
        e.stopPropagation();
        state.current = e.object.material.name;
      }}
      //click and missed
      onPointerMissed={(e) => {
        state.current = null;
      }}
    >
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe.geometry}
        material={materials.laces}
        material-color={snap.items.laces}
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_1.geometry}
        material={materials.mesh}
        material-color={snap.items.mesh}
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_2.geometry}
        material={materials.caps}
        material-color={snap.items.caps}
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_3.geometry}
        material={materials.inner}
        material-color={snap.items.inner}
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_4.geometry}
        material={materials.sole}
        material-color={snap.items.sole}
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_5.geometry}
        material={materials.stripes}
        material-color={snap.items.stripes}
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_6.geometry}
        material={materials.band}
        material-color={snap.items.band}
      />
      <mesh
        receiveShadow
        castShadow
        geometry={nodes.shoe_7.geometry}
        material={materials.patch}
        material-color={snap.items.patch}
      />
    </group>
  );
}

function Picker() {
  const snap = useSnapshot(state);
  return (
    <div className=" flex flex-col md:flex-col   gap-4 md:gap-8  justify-center items-center  bg-gray-100 rounded-xl">
      {/* Snap is the state from valtio, in that object, choosing the .items and in the items object chosing the color of the current chosen by [current]
      bascially for the color picker to show the color of the current selected object on the shoe*/}
      <HexColorPicker
        className="w-24"
        color={snap.items[snap.current]}
        onChange={(color) => (state.items[snap.current] = color)}
      />

      <h1 className="text-2xl md:text-5xl font-extralight capitalize select-none	">
        {snap.current ? snap.current : "Choose"}
      </h1>
    </div>
  );
}

export default function App() {
  const ref = useRef();
  const orbitref = useRef();

  function downloadScreenshot() {
    const image = ref.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.setAttribute("download", "screenshot.png");
    a.setAttribute("href", image);
    a.click();
  }

  let initialPosition = window.innerWidth < 500 ? [0, 0, 4.25] : [0, 0, 3.25];

  return (
    <div className="flex flex-col md:flex-row justify-center  items-center w-screen h-screen bg-gray-100 overflow-x-hidden">
      <Canvas
        className="bg-gray-200"
        shadows
        camera={{ position: initialPosition, fov: 45 }}
        ref={ref}
        gl={{ preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.7} />
        <spotLight
          intensity={0.5}
          angle={0.1}
          penumbra={1}
          position={[10, 15, 10]}
          castShadow
        />
        <Shoe />
        <Environment preset="city" />
        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.25}
          scale={10}
          blur={1.5}
          far={0.8}
        />
        <OrbitControls
          ref={orbitref}
          maxPolarAngle={Math.PI / 2}
          enableZoom={false}
        />
      </Canvas>
      <div className=" flex flex-col justify-evenly items-center  w-screen md:w-[280px]  h-[50vh] md:h-screen  p-2 px-8 gap-2 md:gap-0 md:p-8  bg-gray-100 overflow-y-visible 	 ">
        <div className="flex justify-center items-center gap-2">
          <h1 className=" text-3xl md:text-6xl font-medium pointer-events-none select-none	  ">
            Kicks Lab
          </h1>
          <a href="https://github.com/Swebi/KicksLab">
            <IoLogoGithub className="text-3xl md:text-6xl" />
          </a>
        </div>
        <Picker />

        <button
          className=" m-2 md:m-4 p-2 md:p-5 px-4 md:px-8 shadow-lg rounded-full  border text-sm md:text-2xl select-none	"
          onClick={() => {
            orbitref.current.reset();
            setTimeout(() => {
              downloadScreenshot();
            }, 1500);
          }}
        >
          Download
        </button>

        <h1 className=" text-[10px] md:text-sm font-light select-none	">
          Made By Suhayb
        </h1>
      </div>
    </div>
  );
}
