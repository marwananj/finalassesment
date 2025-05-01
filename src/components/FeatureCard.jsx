const FeatureCard = ({ title, description, icon, link }) => {
  return (
    <div 
      className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => console.log(`Navigating to ${link}`)}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 text-primary">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  )
}

export default FeatureCard