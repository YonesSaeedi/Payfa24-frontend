
import HeaderLayout from "../../layouts/HeaderLayout";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import ConnectedDevices from "../../components/ConnectedDevices/ConnectedDevices";

const ConnectedDevicesLayout = () => {
  return (
    <div className="h-full">
      <HeaderLayout>
        <div className="bg-backgroundMain min-h-screen w-full">
          <div className="container-style flex flex-col gap-8 lg:gap-12">
            <div className="mt-7 lg:mt-4">
              <BreadcrumbNavigation />
            </div>
       <ConnectedDevices/>
          </div>
        </div>
      </HeaderLayout>
    </div>
  );
};

export default ConnectedDevicesLayout;
