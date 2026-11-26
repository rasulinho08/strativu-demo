import { GRC } from "../../data/grc360";
import { ProductBar } from "./ProductBar";

/** GRC360 product bar: overview and the early access / demo form. Modules, frameworks and security live on the GRC360 website. */
export function Grc360Nav() {
  return (
    <ProductBar
      name="GRC360"
      mark="/projects/grc360/grc360-mark-40.webp"
      home={GRC.base}
      pages={[
        { label: "Overview", az: "Ümumi baxış", to: GRC.base },
        { label: "Early access & demo", az: "Erkən giriş və demo", to: GRC.earlyAccess },
      ]}
    />
  );
}
