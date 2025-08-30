import { useContext } from "react"
import Header from "../Components/Header/Header"
import { ThemeContext } from "../Context/ThemeContext";

type HeaderLayoutProps = {
  children?: React.ReactNode
}
const HeaderLayout = ({ children }: HeaderLayoutProps) => {
   
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const {theme} = context;


  return (
    <div className={`min-h-screen flex flex-col  ${theme === "dark" ? 'bg-white4' :'bg-white4'}`}>
      <Header/>
      {children}
    </div>
  )
}

export default HeaderLayout