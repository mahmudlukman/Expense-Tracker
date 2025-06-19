import { getInitials } from "../../utils/helper";

interface CharAvatarProps {
  name: string;
  width?: string;
  height?: string;
  style?: string;
}

const CharAvatar = ({ name, width, height, style }: CharAvatarProps) => {
  return (
    <div className={`${width || 'w-12'} ${height || 'h-12'} ${style || ''} flex items-center justify-center rounded-full text-gray-900 font-medium bg-gray-100`}>
      {getInitials(name || "")}
    </div>
  );
};

export default CharAvatar;
