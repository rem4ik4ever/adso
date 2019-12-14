import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#63a4ff",
      dark: "#004ba0"
    },
    secondary: {
      main: "#c51162",
      light: "#fb558f",
      dark: "#8e0038"
    },
    error: {
      main: red.A400
    },
    background: {
      default: "#fff"
    }
  }
});

export default theme;
