import { SIDE_MENU_DATA } from "../../utils/data";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLogOutMutation } from "../../redux/features/auth/authApi";
import type { RootState } from "../../@types";
import CharAvatar from "../Cards/CharAvatar";

const SideMenu = ({ activeMenu }: { activeMenu: string }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [logout, { isLoading: isLoggingOut }] = useLogOutMutation();
  const navigate = useNavigate();

  const handleClick = (route: string) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.avatar?.url ? (
          <img
            src={user?.avatar?.url || ""}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 rounded-full"
          />
        ) : (
          <CharAvatar
            name={user?.name || ""}
            width="w-20"
            height="h-20"
            style="text-xl"
          />
        )}

        <h5 className="text-gray-950 font-medium leading-6">
          {user?.name || ""}
        </h5>
      </div>

      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu == item.label ? "text-white bg-primary" : ""
          } py-3 px-6 rounded-lg mb-3`}
          onClick={() => handleClick(item.path)}
          disabled={item.path === "logout" && isLoggingOut}
        >
          <item.icon className="text-xl" />
          <span>
            {item.path === "logout" && isLoggingOut
              ? "Logging out..."
              : item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
