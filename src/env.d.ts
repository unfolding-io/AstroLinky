/// <reference path="../.astro/types.d.ts" />

declare module 'qr-image' {
    interface QROptions {
      type?: 'svg' | 'png' | 'eps' | 'pdf';
      size?: number;
      margin?: number;
      ec_level?: 'L' | 'M' | 'Q' | 'H';
    }
  
    function image(text: string, options?: QROptions): any;
  
    export { image };
  }