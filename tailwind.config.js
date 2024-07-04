/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // ### Primary
        "1Desaturated-Dark-Cyan": "hsl(180, 29%, 50%)",

        // ### Neutral
        "2Light-Grayish-Cyan-Background": "hsl(180, 52%, 96%)",
        "3Light-Grayish-Cyan-Filter-Tablets": "hsl(180, 31%, 95%)",
        "4Dark-Grayish-Cyan": "hsl(180, 8%, 52%)",
        "5Very-Dark-Grayish-Cyan": "hsl(180, 14%, 20%)",
      },
      backgroundImage: {
        "small-image": 'url("/images/bg-header-mobile.svg")',
        "large-image": 'url("/images/bg-header-desktop.svg")',
      },
    },
  },
  plugins: [],
};
