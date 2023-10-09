import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Audio } from 'expo-av';
import Modal from 'react-native-modal';

export default function PomodoroTimer() {
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [isWorking, setIsWorking] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [audio1Playing, setAudio1Playing] = useState(false);
  const [audio2Playing, setAudio2Playing] = useState(false);
  const [audio3Playing, setAudio3Playing] = useState(false);

  let interval = null;
  let alarmSound = new Audio.Sound();
  let audio1 = new Audio.Sound();
  let audio2 = new Audio.Sound();
  let audio3 = new Audio.Sound();

  const playAudio1 = async () => {
    try {
      await audio1.unloadAsync();
      await audio1.loadAsync(require('./audio1.mp3'));
      await audio1.playAsync();
      setAudio1Playing(true);
      setAudio2Playing(false);
      setAudio3Playing(false);
    } catch (error) {
      console.error('Error playing audio1', error);
    }
  };

  const playAudio2 = async () => {
    try {
      await audio2.unloadAsync();
      await audio2.loadAsync(require('./audio2.mp3'));
      await audio2.playAsync();
      setAudio1Playing(false);
      setAudio2Playing(true);
      setAudio3Playing(false);
    } catch (error) {
      console.error('Error playing audio2', error);
    }
  };

  const playAudio3 = async () => {
    try {
      await audio3.unloadAsync();
      await audio3.loadAsync(require('./audio3.mp3'));
      await audio3.playAsync();
      setAudio1Playing(false);
      setAudio2Playing(false);
      setAudio3Playing(true);
    } catch (error) {
      console.error('Error playing audio3', error);
    }
  };

  const playAlarmSound = async () => {
    try {
      await alarmSound.unloadAsync();
      await alarmSound.loadAsync(require('./alarm.mp3'));
      await alarmSound.playAsync();
    } catch (error) {
      console.error('Error playing alarm sound', error);
    }
  };

  useEffect(() => {
    if (!isPaused) {
      interval = setInterval(() => {
        if (currentTime > 0) {
          setCurrentTime(currentTime - 1);
        } else {
          clearInterval(interval);
          handleSwitchMode();
          if (alarmEnabled) {
            playAlarmSound();
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [currentTime, isPaused, alarmEnabled]);

  const handleSwitchMode = async () => {
    setIsWorking(!isWorking);
    setCurrentTime(isWorking ? breakTime * 60 : workTime * 60);

    if (isWorking && alarmEnabled) {
      playAlarmSound();
    }
  };

  const handleSkip = () => {
    clearInterval(interval);
    if (isWorking) {
      setIsWorking(false);
      setCurrentTime(breakTime * 60);
    } else {
      setIsWorking(true);
      setCurrentTime(workTime * 60);
    }
    setIsPaused(true);
  };

  const handleTimerInputChange = (value, isWorkTime) => {
    const newTime = parseInt(value, 10);
    if (!isNaN(newTime)) {
      if (isWorkTime) {
        setWorkTime(newTime);
      } else {
        setBreakTime(newTime);
      }
      if (!isPaused) {
        handleSwitchMode();
      }
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setIsPaused(true);
    setIsWorking(true);
    setCurrentTime(workTime * 60);
    setBreakTime(5);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {!isModalVisible && (
          <Icon
            name="bars"
            size={30}
            onPress={toggleModal}
            style={styles.settingsButton}
            color="#3A86FF"
          />
        )}
      </View>
      <Text style={styles.title}>{isWorking ? 'Work Time' : 'Break Time'}</Text>
      <Text style={styles.timer}>{formatTime(currentTime)}</Text>
      <View style={styles.buttonRow}>
        <Button
          title={isPaused ? 'Start' : 'Pause'}
          onPress={toggleTimer}
          style={styles.button}
          color="#3A86FF"
        />
        <Button
          title="Skip"
          onPress={handleSkip}
          style={styles.button}
          color="#3A86FF"
        />
        <Button
          title="Reset"
          onPress={resetTimer}
          style={styles.button}
          color="#3A86FF"
        />
      </View>
      {/* Audio buttons */}
      <View style={styles.audioButtons}>
        <Button
          title="Play Audio 1"
          onPress={playAudio1}
          style={styles.button}
          color="#3A86FF"
          disabled={!isWorking || audio1Playing}
        />
        <Button
          title="Play Audio 2"
          onPress={playAudio2}
          style={styles.button}
          color="#3A86FF"
          disabled={!isWorking || audio2Playing}
        />
        <Button
          title="Play Audio 3"
          onPress={playAudio3}
          style={styles.button}
          color="#3A86FF"
          disabled={!isWorking || audio3Playing}
        />
      </View>
      <Modal isVisible={isModalVisible}>
        {/* ... (modal content) */}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRow: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  settingsButton: {
    width: 100,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  timer: {
    fontSize: 48,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-evenly',
    width: '100%',
  },
  button: {
    width: 100,
  },
  settings: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabel: {
    flex: 1,
    marginRight: 10,
  },
  input: {
    flex: 2,
    height: 40,
    width: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
  },
  saveButton: {
    width: 100,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  audioButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
  },
});

