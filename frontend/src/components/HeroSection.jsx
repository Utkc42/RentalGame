import heroImage from "../assets/heroImage.jpeg";

const HeroSection = () => {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat rounded-md"
      style={{ backgroundImage: `url(${heroImage})`, height: "600px" }}
    ></div>
  );
};

export default HeroSection;
