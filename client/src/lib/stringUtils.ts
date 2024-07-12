export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const genRandomHexColor = () => {
  return "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
};

export const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, "");
};
