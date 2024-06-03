import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  CameraType,
  useCameraPermissions,
  CameraView,
  useMicrophonePermissions,
} from "expo-camera";
import React from "react";

export default function HomeScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = React.useState<CameraType>("front");

  const [permission, requestPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [isRecording, setIsRecording] = useState(false);
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted || !micPermission?.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button
          onPress={async () => {
            await requestPermission();
            await requestMicPermission();
          }}
          title="grant permission"
        />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function startRecording() {
    console.log("start recording");
    setIsRecording(true);
    try {
      const recording = await cameraRef?.current?.recordAsync({
        maxDuration: 60,
      });

      console.log("Recording complete:", recording?.uri);
    } catch (e) {
      console.log("Recording error:", e);
    }
  }
  async function stopRecording() {
    console.log("Stop recording");
    setIsRecording(false);
    await cameraRef?.current?.stopRecording();
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode="video"
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Text style={styles.text}>
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
