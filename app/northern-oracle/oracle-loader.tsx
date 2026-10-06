import Image from "next/image";

import logo from "../../public/svg/logo.svg";

export function OracleLoader() {
  return (
    <div className="oracle-loader" role="status" aria-label="Loading oracle">
      <Image className="oracle-loader-logo" src={logo} alt="" priority />
    </div>
  );
}
