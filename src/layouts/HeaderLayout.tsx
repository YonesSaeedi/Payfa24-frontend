import Header from "../components/Header/Header"

type HeaderLayoutProps = {
  children?: React.ReactNode
}

const HeaderLayout = ({ children }: HeaderLayoutProps) => {

  return (
    <div className='min-h-screen flex flex-col bg-white4'>
      <Header />
      <div className="pt-16 pb-5 lg:pb-20"> {/* فاصله محتوا از هدر */}
        {children}
      </div>
    </div>
  )
}

export default HeaderLayout