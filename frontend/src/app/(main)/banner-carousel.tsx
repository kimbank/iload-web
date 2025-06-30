export default function Home() {
  return (
    <section className="flex flex-col items-center">
      <img
        src="/banner/application-install.png"
        alt="Application Banner"
        className="w-full h-auto object-cover"
      />
      {/* <span className="block h-8" />
       */}
      <span className="flex h-8">
        <img
          src="/banner/example.png"
          alt="example"
          width={66}
          className="self-center"
        />
      </span>
    </section>
  );
}
