import { useState } from "react";
import { TopNavigation, Toggle } from "@cloudscape-design/components";
import { Mode } from "@cloudscape-design/global-styles";
import { StorageHelper } from "../common/helpers/storage-helper";
import { APP_NAME } from "../common/constants";

// Define styles as objects for better maintainability
const styles = {
  headerContainer: {
    zIndex: 1002,
    top: 0,
    left: 0,
    right: 0,
    position: "fixed",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Add subtle shadow for depth
  },
  toggleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "4px 0", // Add a bit of padding for better spacing
  },
  toggleLabel: {
    marginRight: "12px", // Space between text and toggle
    fontWeight: 500, // Medium weight for better visibility
  }
};

export default function GlobalHeader() {
  const [theme, setTheme] = useState<Mode>(StorageHelper.getTheme());

  const onChangeThemeClick = (checked: boolean) => {
    if (checked) {
      setTheme(StorageHelper.applyTheme(Mode.Dark));
    } else {
      setTheme(StorageHelper.applyTheme(Mode.Light));
    }
  };

  return (
    <div style={styles.headerContainer} id="awsui-top-navigation">
      <TopNavigation
        identity={{
          href: "/",
          logo: { src: "/images/logo.png", alt: `${APP_NAME} Logo` },
        }}
        utilities={[
          {
            type: "menu-dropdown",
            text: "Theme",
            iconName: theme === Mode.Dark ? "moon" : "sun",
            items: [
              {
                id: "theme-toggle",
                text: (
                  <div style={styles.toggleContainer}>
                    <span style={styles.toggleLabel}>Dark mode</span>
                    <Toggle
                      checked={theme === Mode.Dark}
                      onChange={({ detail }) => onChangeThemeClick(detail.checked)}
                    />
                  </div>
                ),
              },
            ],
          },
        ]}
      />
    </div>
  );
}