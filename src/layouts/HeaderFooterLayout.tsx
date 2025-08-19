
import Footer from "../Components/Footer/Footer";
import Header from "../Components/Header/Header";

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
