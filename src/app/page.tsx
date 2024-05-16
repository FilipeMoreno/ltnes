import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
    <Image
      className="relative"
      src="/logo.svg"
      alt="Ltnes Logo"
      width={600}
      height={400}
      priority
    />
    <div>
      <h1 className="text-4xl -mt-16">EM BREVE</h1>
    </div>
    </main>
  );
}
