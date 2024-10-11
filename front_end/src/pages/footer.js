import "../styles/footer.css";

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const Footer = () => {
  return (
    <footer>
      <p>sHule © {getCurrentYear()}</p>
    </footer>
  );
};

export default Footer;
