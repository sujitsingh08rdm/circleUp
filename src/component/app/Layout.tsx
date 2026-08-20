import { Link } from "react-router-dom";
import Avatar from "../shared/Avatar";
import Card from "../shared/Card";

const Layout = () => {
  const leftAsideSize = 350;
  const rightAsideSize = 400;

  const sectionDimention = {
    width: `calc(100% - ${leftAsideSize + rightAsideSize}px)`,
    marginLeft: leftAsideSize,
  };

  const menus = [
    {
      id: "01",
      href: "/app",
      label: "dashboard",
      icon: "ri-dashboard-horizontal-fill",
    },
    { id: "02", href: "/post", label: "my posts", icon: "ri-sticky-note-fill" },
    { id: "03", href: "/friends", label: "friends", icon: "ri-group-3-fill" },
  ];

  return (
    <div className="min-h-screen">
      <aside
        className="p-8 h-full bg-white overflow-auto fixed left-0 top-0"
        style={{ width: leftAsideSize }}
      >
        <div className="space-y-8 rounded-2xl h-full p-8 bg-linear-to-br from-[#3D4E81] via-[#5753C9] to-[#6E7FF3]">
          <Avatar
            title="Arushi"
            subtitle="MNC Engineer"
            image="/images/avtar.jpg"
          />

          <div>
            {menus.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className="flex text-gray-300 gap-3 items-center py-3 px-1 hover:text-gray-100 hover:font-medium"
              >
                <i className={`${item.icon} text-xl`}></i>
                <label className="capitalize">{item.label}</label>
              </Link>
            ))}

            <button className="flex text-gray-300 gap-3 items-center py-3 px-1 hover:text-gray-100 hover:font-medium">
              <i className="ri-logout-box-r-line text-xl"></i>
              <label>Logout</label>
            </button>
          </div>
        </div>
      </aside>
      <section className="rounded-2xl py-8 px-2" style={sectionDimention}>
        <Card></Card>
      </section>
      <aside
        className="p-8 h-full bg-white overflow-auto fixed right-0 top-0"
        style={{ width: rightAsideSize }}
      >
        <Card title="Friends" divider>
          <div className="space-y-4">
            {Array(20)
              .fill(0)
              .map((item, index) => (
                <Avatar
                  size="md"
                  image="/images/default.png"
                  title="Monu Kumar"
                  titleColor="black"
                  subtitle={
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <label className="text-xs font-normal text-gray-500">
                        Online
                      </label>
                    </div>
                  }
                />
              ))}
          </div>
        </Card>
      </aside>
    </div>
  );
};

export default Layout;
