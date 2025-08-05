import DashboardSidebar from "../components/DashboardSidebar"
import PhotoManagement from "../components/seller/PhotoManagement"

const SellerDashboard = () => {
  return (
    <div className="flex flex-col sm:flex-row">
      <DashboardSidebar />
      <div>
        {/* We will change the pages through Switch Case here */}
        <PhotoManagement />
      </div>
    </div>
  )
}

export default SellerDashboard
