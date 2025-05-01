const NavybitsText = () => {
  const text = "Navybits Academy";
  
  return (
    <div className="navybits-text">
      {text.split('').map((letter, index) => (
        <span 
          key={index}
          style={{ 
            animationDelay: `${index * 0.1}s`
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
};

export default NavybitsText;