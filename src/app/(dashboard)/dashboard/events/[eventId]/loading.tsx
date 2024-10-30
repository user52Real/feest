export default function LoadingEventPage() {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="mt-1 h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="flex space-x-3">
              <div className="h-10 w-24 bg-gray-200 rounded"></div>
              <div className="h-10 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
  
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="sm:col-span-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }