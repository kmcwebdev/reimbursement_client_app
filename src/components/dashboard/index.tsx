import React from "react";
import { useUserAccessContext } from "~/context/AccessContext";
import EmployeeDashboard from "./Employee";
import FinanceDashboard from "./Finance";
import HrbpDashboard from "./Hrbp";
import ManagerDashboard from "./Manager";
import Sample from "./Sample";
import { Button } from "~/components/core/Button";
import ReimbursementsCardView from "~/components/reimbursementView"
import { useDialogState } from "~/hooks/use-dialog-state";
import { sampleData } from "~/utils/sampleDataReim";

const DashboardComponent: React.FC = () => {
  const {
    isVisible: sideDrawerIsVisible,
    open: openDrawer,
    close: closeDrawer,
  } = useDialogState();
  
  const { user } = useUserAccessContext();
  return (
    <>
      {user && (
        <>
          {user.role === "employee" && <EmployeeDashboard />}
          {user.role === "finance" && <FinanceDashboard />}
          {user.role === "hrbp" && <HrbpDashboard />}
          {user.role === "manager" && <ManagerDashboard />}
          {user.role === "sample" && <Sample />}
        </>
      )}
      {/* Example button for ReimbursementsCardView to open*/}
      <ReimbursementsCardView 
        data={sampleData} 
        isVisible={sideDrawerIsVisible} 
        closeDrawer={closeDrawer} 
        title='R2023-1'>
      </ReimbursementsCardView>
      
      <Button onClick={openDrawer}>View</Button>
    </>
  );
};

export default DashboardComponent;
