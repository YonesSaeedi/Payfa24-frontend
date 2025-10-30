import React from "react";

interface IdentityCardProps {
  level: string; 
  title: string; 
  items: {
    label: string; 
    from: string;  
    to: string;    
  }[];
}

const IdentityCard: React.FC<IdentityCardProps> = ({ level, title, items }) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
     
      <h3 className="text-blue-600 font-medium mb-3">
        {level} : {title}
      </h3>


      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index}>
            <p className="text-gray-600 text-sm">{item.label}</p>
            <p className="text-gray-800 text-sm">
              {item.from} از {item.to}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdentityCard;
