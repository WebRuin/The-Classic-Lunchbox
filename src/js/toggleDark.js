import colors from '../scss/base/_colors.scss';

const today = new Date().getHours();

if (today >= 7 && today <= 19) {
} else {
  colors.darkPurple = colors.dayDarkPurple;
  colors.lightPurple = colors.dayLightPurple;
  colors.brightYellow = colors.dayBrightYellow;
  colors.lightTeal = colors.dayLightTeal;
  colors.darkTeal = colors.dayDarkTeal;
}

toogle.addEventListener('click', () => {});
