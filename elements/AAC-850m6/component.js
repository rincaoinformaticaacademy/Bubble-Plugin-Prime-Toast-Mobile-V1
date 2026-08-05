function(props) {
  const React = props.context.libraries["react"];
  const ReactNative = props.context.libraries["react-native"];

  const {
    Modal,
    View,
    Text,
    Animated,
    Easing,
    SafeAreaView,
    Platform,
    StatusBar
  } = ReactNative;

  const {
    useEffect,
    useRef,
    useState
  } = React;

  const elementProperties = props.properties || {};
  const isWeb = Platform.OS === "web";

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
    position: "top",
    showIcon: true,
    customIcon: ""
  });

  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const hideTimer = useRef(null);
  const animationTimer = useRef(null);

  function numberValue(value, fallback) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return parsed;
  }

  function clearTimers() {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
      animationTimer.current = null;
    }
  }

  function getPosition() {
    const position = String(toast.position || "top").trim().toLowerCase();
    if (position === "bottom") return "bottom";
    if (position === "center") return "center";
    return "top";
  }

  function getAlignment() {
    const alignment = String(elementProperties.alignment || "center").toLowerCase();
    if (alignment === "left") return "left";
    if (alignment === "right") return "right";
    return "center";
  }

  function getAnimationType() {
    const animation = String(elementProperties.animation || "fade-slide").toLowerCase();
    if (animation === "fade") return "fade";
    if (animation === "slide") return "slide";
    return "fade-slide";
  }

  function getInitialTranslation() {
    const position = getPosition();
    const alignment = getAlignment();
    let x = 0;
    let y = 0;
    if (position === "top") {
      y = -24;
    } else if (position === "bottom") {
      y = 24;
    }
    if (position === "center") {
      if (alignment === "left") x = -24;
      else if (alignment === "right") x = 24;
    }
    return { x, y };
  }

  function animateIn() {
    const animationType = getAnimationType();
    const animationDuration = Math.max(0, numberValue(elementProperties.animation_duration, 250));
    const initial = getInitialTranslation();

    opacity.stopAnimation();
    translateX.stopAnimation();
    translateY.stopAnimation();

    opacity.setValue(animationType === "slide" ? 1 : 0);
    translateX.setValue(animationType === "fade" ? 0 : initial.x);
    translateY.setValue(animationType === "fade" ? 0 : initial.y);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1, duration: animationDuration,
        easing: Easing.out(Easing.cubic), useNativeDriver: false
      }),
      Animated.timing(translateX, {
        toValue: 0, duration: animationDuration,
        easing: Easing.out(Easing.cubic), useNativeDriver: false
      }),
      Animated.timing(translateY, {
        toValue: 0, duration: animationDuration,
        easing: Easing.out(Easing.cubic), useNativeDriver: false
      })
    ]).start();
  }

  function hideToast() {
    const animationType = getAnimationType();
    const animationDuration = Math.max(0, numberValue(elementProperties.animation_duration, 250));
    const finalTranslation = getInitialTranslation();

    opacity.stopAnimation();
    translateX.stopAnimation();
    translateY.stopAnimation();

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: animationType === "slide" ? 1 : 0, duration: animationDuration,
        easing: Easing.in(Easing.cubic), useNativeDriver: false
      }),
      Animated.timing(translateX, {
        toValue: animationType === "fade" ? 0 : finalTranslation.x, duration: animationDuration,
        easing: Easing.in(Easing.cubic), useNativeDriver: false
      }),
      Animated.timing(translateY, {
        toValue: animationType === "fade" ? 0 : finalTranslation.y, duration: animationDuration,
        easing: Easing.in(Easing.cubic), useNativeDriver: false
      })
    ]).start();

    animationTimer.current = setTimeout(function() {
      setToast(function(currentToast) {
        return { ...currentToast, visible: false };
      });
    }, animationDuration);
  }

  function showToast(actionProperties) {
    clearTimers();

    const incoming = actionProperties || {};
    const message = incoming.message === null || incoming.message === undefined
      ? "" : String(incoming.message);

    const validTypes = ["blank", "success", "error", "loading"];
    const requestedType = String(incoming.type || "success").toLowerCase();
    const type = validTypes.includes(requestedType) ? requestedType : "success";

    const duration = Math.max(0, numberValue(incoming.duration, 4000));

    const requestedPosition = String(incoming.position || "top").trim().toLowerCase();
    const position = requestedPosition === "center" || requestedPosition === "bottom"
      ? requestedPosition : "top";

    setToast({
      visible: true,
      message: message,
      type: type,
      position: position,
      showIcon: incoming.show_icon !== false,
      customIcon: incoming.custom_icon === null || incoming.custom_icon === undefined
        ? "" : String(incoming.custom_icon)
    });

    requestAnimationFrame(function() {
      animateIn();
    });

    hideTimer.current = setTimeout(function() {
      hideToast();
    }, duration);
  }

  props.instance.data.notify = showToast;

  useEffect(function() {
    return function() {
      clearTimers();
      opacity.stopAnimation();
      translateX.stopAnimation();
      translateY.stopAnimation();
      if (props.instance && props.instance.data) {
        delete props.instance.data.notify;
      }
    };
  }, []);

  function getTypeStyle() {
    const type = toast.type;
    if (type === "error") {
      return {
        background: elementProperties.error_bg || "#FED9D9",
        text: elementProperties.error_txt || "#E67070",
        border: elementProperties.error_border || "#FFA2A2",
        icon: elementProperties.error_icon || "❌"
      };
    }
    if (type === "loading") {
      return {
        background: elementProperties.loading_bg || "#FFFFFF",
        text: elementProperties.loading_txt || "#102A43",
        border: elementProperties.loading_border || "#D6DCF2",
        icon: elementProperties.loading_icon || "⏳"
      };
    }
    if (type === "blank") {
      return {
        background: elementProperties.blank_bg || "#FFFFFF",
        text: elementProperties.blank_txt || "#102A43",
        border: elementProperties.blank_border || "#DAE2E9",
        icon: elementProperties.blank_icon || "ℹ️"
      };
    }
    return {
      background: elementProperties.success_bg || "#DAFCE8",
      text: elementProperties.success_txt || "#1B5C55",
      border: elementProperties.success_border || "#A4E2BE",
      icon: elementProperties.success_icon || "👍"
    };
  }

  function getContainerStyle() {
    return { flex: 1, width: "100%", alignSelf: "stretch" };
  }

  function getPositionWrapperStyle() {
    const position = getPosition();
    const alignment = getAlignment();

    const horizontalMargin = Math.max(0, numberValue(elementProperties.horizontal_margin, 16));
    const verticalMargin = Math.max(0, numberValue(elementProperties.vertical_margin, 24));
    const webSafeAreaTopExtra = isWeb ? 52 : 0;
    const webSafeAreaBottomExtra = isWeb ? 32 : 0;

    let alignItems = "center";
    if (alignment === "left") alignItems = "flex-start";
    else if (alignment === "right") alignItems = "flex-end";

    const style = {
      position: "absolute",
      left: 0,
      right: 0,
      paddingHorizontal: horizontalMargin,
      alignItems: alignItems
    };

    if (position === "bottom") {
      style.bottom = verticalMargin + webSafeAreaBottomExtra;
      return style;
    }
    if (position === "center") {
      style.top = 0;
      style.bottom = 0;
      style.justifyContent = "center";
      return style;
    }
    style.top = verticalMargin + webSafeAreaTopExtra;
    return style;
  }

  const typeStyle = getTypeStyle();

  const widthPercent = Math.min(100, Math.max(10, numberValue(elementProperties.toast_width, 90)));

  const selectedIcon = toast.customIcon.trim() !== "" ? toast.customIcon : typeStyle.icon;

  if (!toast.visible) {
    return null;
  }

  const toastContent = (
    <View style={{ flex: 1 }}>
      <SafeAreaView pointerEvents="none" style={getContainerStyle()}>
        <View style={getPositionWrapperStyle()}>
          <Animated.View
            style={{
              width: widthPercent + "%",
              maxWidth: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              paddingHorizontal: Math.max(0, numberValue(elementProperties.padding_horizontal, 16)),
              paddingVertical: Math.max(0, numberValue(elementProperties.padding_vertical, 12)),
              backgroundColor: typeStyle.background,
              borderColor: typeStyle.border,
              borderWidth: Math.max(0, numberValue(elementProperties.border_size, 1)),
              borderRadius: Math.max(0, numberValue(elementProperties.border_radius, 12)),
              opacity: opacity,
              transform: [
                { translateX: translateX },
                { translateY: translateY }
              ]
            }}
          >
            {toast.showIcon && selectedIcon !== "" ? (
              <Text
                style={{
                  fontSize: Math.max(1, numberValue(elementProperties.icon_size, 18)),
                  marginRight: Math.max(0, numberValue(elementProperties.icon_spacing, 8))
                }}
              >
                {selectedIcon}
              </Text>
            ) : null}

            <Text
              style={{
                flexShrink: 1,
                textAlign: "center",
                color: typeStyle.text,
                fontSize: Math.max(1, numberValue(elementProperties.font_size, 15))
              }}
            >
              {toast.message}
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );

  /*
   * No web (WebView do editor), o Modal do RN faz um portal pra
   * document.body com position fixed, e não respeita o container
   * real do plugin dentro do webview -> "estoura" a tela.
   * No nativo (BubbleGo), o Modal é a camada nativa real e funciona bem.
   * Por isso: nativo usa Modal, web usa uma View com position "fixed"
   * relativa à viewport, o que a mantém flutuante e por cima de tudo
   * sem cortar dentro do container do plugin.
   */
  if (isWeb) {
    return (
      <View
        pointerEvents="box-none"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999
        }}
      >
        {toastContent}
      </View>
    );
  }

  return (
    <Modal
      visible={toast.visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={false}
      navigationBarTranslucent={true}
      presentationStyle="overFullScreen"
      onRequestClose={hideToast}
    >
      {toastContent}
    </Modal>
  );
}