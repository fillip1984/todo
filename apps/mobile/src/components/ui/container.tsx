import type { VariantProps } from "class-variance-authority";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cva } from "class-variance-authority";

import { cn } from "~/styles/utils";

const containerVariants = cva("flex h-screen", {
  variants: {
    variant: {
      default: "bg-black",
      sheet: "bg-zinc-800",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export default function Container({
  className,
  variant,
  children,
  headerShown,
  ...props
}: React.ComponentProps<typeof TouchableWithoutFeedback> &
  VariantProps<typeof containerVariants> & { headerShown?: boolean }) {
  return (
    <>
      {headerShown ? (
        // no need to include SafeAreaView since header is shown
        <ContainerInternals className={className} variant={variant} {...props}>
          {children}
        </ContainerInternals>
      ) : (
        <SafeAreaView>
          <ContainerInternals
            className={className}
            variant={variant}
            {...props}
          >
            {children}
          </ContainerInternals>
        </SafeAreaView>
      )}
    </>
  );
}

const ContainerInternals = ({
  className,
  variant,
  children,

  ...props
}: React.ComponentProps<typeof TouchableWithoutFeedback> &
  VariantProps<typeof containerVariants>) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      className={cn(containerVariants({ variant }), className)}
      {...props}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className={cn(containerVariants({ variant }), className)}>
          {children}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
