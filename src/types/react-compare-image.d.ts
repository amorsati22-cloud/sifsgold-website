declare module "react-compare-image" {
  import type { ComponentType } from "react";
  interface ReactCompareImageProps {
    leftImage: string;
    rightImage: string;
    sliderPositionPercentage?: number;
    sliderLineColor?: string;
    handleSize?: number;
  }
  const ReactCompareImage: ComponentType<ReactCompareImageProps>;
  export default ReactCompareImage;
}
