
const Sidebar = () => {
  const menuItems = [
    { name: 'الرئيسية', icon: '🏠' },
    { name: 'الأسئلة', icon: '❓' },
    { name: 'المنح الدراسية', icon: '🎓' },
    { name: 'فرص التدريب', icon: '💼' },
    { name: 'المسابقات', icon: '🏆' },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="text-2xl font-bold mb-8">SSB</div>
      <ul>
        {menuItems.map((item) => (
          <li key={item.name} className="mb-4">
            <a href="#" className="flex items-center p-2 rounded-md hover:bg-gray-700">
              <span className="mr-4">{item.icon}</span>
              <span>{item.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
