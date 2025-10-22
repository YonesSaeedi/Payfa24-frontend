import Footer from "../Components/Footer/Footer";
import Header from "../Components/Header/Header";

interface HeaderFooterLayoutProps {
  children: React.ReactNode;
}

const HeaderFooterLayout = ({ children }: HeaderFooterLayoutProps) => {
  return (
    <div className="flex flex-col justify-between">
      <Header />
    <div className="pt-[64px]"> {/* فاصله محتوا از هدر */}
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default HeaderFooterLayout;
