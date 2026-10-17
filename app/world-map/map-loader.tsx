import Image from "next/image";

import logo from "../../public/svg/logo.svg";

export function MapLoader() {
  return (
    <div className="world-map-status" role="status" aria-label="Loading map">
      <Image className="world-map-loader-logo" src={logo} alt="" priority />
    </div>
  );
}
