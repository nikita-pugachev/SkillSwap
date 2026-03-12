declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
