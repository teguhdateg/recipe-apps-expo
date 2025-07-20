import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";

const SafeScreen = ({ children }) => {
  const insest = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: insest.top,
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;
