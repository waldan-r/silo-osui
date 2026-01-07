import Image from "next/image";

const appName = 'Silo';
export default function Hom() {
  return (
    <div id="main-screen" className="p-10 bg-black text-white min-h-screen">
      <h1 id="main-text" className="text-4xl font-bold text-yellow-400">
        {appName}
      </h1>
      <p className="mt-4 text-xl">
        Dari bris
      </p>
      <button className="mt-6 bg-blue-500 px-4 py-2 rounded hover:bg-blue-700">
        Cek partitur
      </button>
    </div>
  );
}
