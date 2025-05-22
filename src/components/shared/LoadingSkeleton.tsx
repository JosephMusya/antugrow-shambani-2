export default function LoadingSkeleton() {
  return (
    <div className="flex min-h-screen bg-gray-50">
          {/* <FarmerSidebar /> */}
          <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mb-8"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
  )
}
