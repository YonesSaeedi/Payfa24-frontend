import { Outlet } from "react-router"
import BreadcrumbNavigation from "../../Components/BreadcrumbNavigation"
import HeaderLayout from "../../layouts/HeaderLayout"


function BankCardsPage() {
   

    return (
     <div className="h-full">
       <HeaderLayout>
        <div className="bg-backgroundMain min-h-screen w-full">
          <div className="container-style flex flex-col gap-8 lg:gap-12">
              <div className="mt-7 lg:mt-4">
              <BreadcrumbNavigation/>
            </div> 
             
                <Outlet />
 
            
            </div>
          </div>
       </HeaderLayout>
     
        
    </div>
    )
}

export default BankCardsPage
