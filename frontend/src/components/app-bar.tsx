import Image from "next/image";
import Link from "next/link";

export default function AppBar() {
  return (
    <div className="fixed top-0 z-50 w-full max-w-2xl min-w-xs bg-white">
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/iload-logo.png"
            alt="iLoad Logo"
            height={34}
            width={106}
          />
        </Link>
      </div>
    </div>
  );
}
