import type { FC, ReactNode } from "react";

interface AvatarInterface {
  title?: string;
  subtitle?: ReactNode;
  image?: string;
  titleColor?: string;
  subtitleColor?: string;
  size?: "lg" | "md";
  key?: string | number;
  onClick?: () => void;
}

const Avatar: FC<AvatarInterface> = ({
  title,
  subtitle = "subtitle missing",
  image,
  titleColor = "white",
  subtitleColor = "white",
  size = "lg",
  key = 0,
  onClick,
}) => {
  return (
    <div key={key} className="flex gap-3 items-center">
      {image && (
        <img
          src={image}
          alt="avatar-image"
          className={`${size === "lg" ? "w-12 h-12" : "w-8 h-8"} rounded-full object-cover`}
          onClick={onClick}
        />
      )}
      {title && subtitle && (
        <div className="flex flex-col">
          <h1
            className={`${size === "lg" ? "text-lg/4" : "text-sm"} font-medium capitalize`}
            style={{ color: titleColor }}
          >
            {title}
          </h1>
          <div style={{ color: subtitleColor }}>{subtitle}</div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
