import { Outlet } from "react-router";
import HeaderLayout from "../../layouts/HeaderLayout";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";

const TicketLayout = () => {
  return (
  
    <div className="h-full">
       <HeaderLayout>
        <div className="bg-backgroundMain min-h-screen w-full">
          <div className="container-style flex flex-col gap-8 lg:gap-12">
              <div className="mt-7 lg:mt-4">
              <BreadcrumbNavigation />
            </div> 
             
                <Outlet />
 
            
            </div>
          </div>
       </HeaderLayout>
     
        
    </div>
  );
};

export default TicketLayout;
