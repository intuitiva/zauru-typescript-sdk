type Props = {
  title?: string;
  description?: string;
};

export const HomeLayout = ({ title, description }: Props) => {
  return (
    <div
      className="bg-cover bg-center h-screen"
      style={{ backgroundImage: 'url("/wallpaper.webp")' }}
    >
      <div className="flex flex-col h-screen justify-center items-center">
        <h1
          className="text-6xl md:text-7xl lg:text-8xl text-white font-bold mb-6 text-center"
          style={{
            textShadow: "0.5px 0.5px 1px #000000",
            WebkitTextStroke: "2px #000000",
          }}
        >
          {title ?? <>Bienvenido, inicie sesión para continuar.</>}
        </h1>
        <p
          className="text-xl md:text-2xl lg:text-3xl text-white text-center max-w-md mb-12"
          style={{
            textShadow: "0.5px 0.5px 1px #000000",
            WebkitTextStroke: "1px #000000",
          }}
        >
          {description ?? <>Web app, realizada en Zauru.</>}
        </p>
      </div>
    </div>
  );
};
