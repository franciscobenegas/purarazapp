export type ThemeColors = "Negro" | "Rojo" | "Azul" | "Verde" | "Naranja";
export interface ThemeColorStateParams {
  themeColor: ThemeColors;
  setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>;
}
