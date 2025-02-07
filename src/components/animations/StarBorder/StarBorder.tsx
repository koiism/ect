const StarBorder = ({
as: Component = "button",
className = "",
color = "currentColor",
speed = "6s",
children,
...rest
}: {
  as: React.ElementType;
  className?: string;
  color?: string;
  speed?: string;
  children?: React.ReactNode;
}) => {
return (
  <Component className={`relative inline-block py-[1px] overflow-hidden rounded-[20px] ${className}`} {...rest}>
    <div
      className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
      style={{
        background: `radial-gradient(circle, ${color}, ${color} 10%, transparent 20%)`,
        animationDuration: speed,
      }}
    ></div>
    <div
      className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
      style={{
        background: `radial-gradient(circle, ${color}, ${color} 10%, transparent 20%)`,
        animationDuration: speed,
      }}
    ></div>
    <div className="relative z-1 bg-gradient-to-b from-black to-gray-900 border border-gray-800 text-white text-center text-[16px] py-[16px] px-[26px] rounded-[20px]">
      {children}
    </div>
  </Component>
);
};

export default StarBorder;
