export default function CardSkeletonMinimal() {
  return (
    <div className="space-y-4 p-4">
      <div className=" bg-gray-300 rounded h-8 w-20" />
      <div className="flex gap-3">
        <div className="bg-gray-300 rounded  h-4 w-24" />
        <div className="bg-gray-300 rounded h-4 w-4 rounded-full" />
        <div className="bg-gray-300 rounded h-4 w-16" />
        <div className="bg-gray-300 rounded h-6 w-14 rounded-md" />
      </div>
      {/* <div className="bg-gray-300 rounded h-px w-full" /> */}
      <div className='bg-gray-300 rounded '>
        <div className="h-4 w-36 mb-2" />
        <div className="flex gap-2">
          <div className="h-6 w-24 rounded-md" />
          <div className="h-6 w-24 rounded-md" />
        </div>
      </div>
    </div>
  )
}
