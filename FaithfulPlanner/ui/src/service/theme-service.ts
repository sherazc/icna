import { UiTheme, type UiThemeConfig } from "./service-types";

export const UI_THEMES: Record<UiTheme, UiThemeConfig> = {
    [UiTheme.BLUE]: { label: "Blue", file: "blue-theme.css" },
    [UiTheme.DARK]: { label: "Dark", file: "dark-theme.css" },
    [UiTheme.DARK_SLATE]: { label: "Dark Slate", file: "dark-slate-theme.css" },
    [UiTheme.DARK_TEAL]: { label: "Dark Teal", file: "dark-teal-theme.css" },
    [UiTheme.GREEN]: { label: "Green", file: "green-theme.css" },
    [UiTheme.ORANGE]: { label: "Orange", file: "orange-theme.css" },
    [UiTheme.PURPLE]: { label: "Purple", file: "purple-theme.css" },
    [UiTheme.RED]: { label: "Red", file: "red-theme.css" },
};

export const UI_THEME_OPTIONS = Object.entries(UI_THEMES).map(([id, theme]) => ({
    id: Number(id),
    name: theme.label
}));

export const uiThemeHref = (uiThemeId?: number): string | undefined => {
    const theme = uiThemeId === undefined ? undefined : UI_THEMES[uiThemeId as UiTheme];
    return theme ? `/scripts/themes/${theme.file}` : undefined;
};
