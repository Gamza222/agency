import type { ImgHTMLAttributes, SVGProps } from 'react';

export interface mockSvgPropsInterface extends SVGProps<SVGSVGElement> {
  title?: string;
}

export interface mockImagePropsInterface extends ImgHTMLAttributes<HTMLImageElement> {}
