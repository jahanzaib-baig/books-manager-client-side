import React from "react";
import Image from "next/image";

export default function Loader() {
  return <Image src="/loading.svg" alt="Loading..." width={100} height={100} />;
}
