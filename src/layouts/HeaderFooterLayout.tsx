import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";

interface HeaderFooterLayoutProps {
  children: React.ReactNode;
}

const HeaderFooterLayout = ({ children }: HeaderFooterLayoutProps) => {
  return (
    <div className="flex flex-col justify-between">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default HeaderFooterLayout;
