import * as React from 'react';
import { Text, View, StyleSheet, Image, Button, TextInput } from 'react-native';
import Constants from 'expo-constants';
import { Card } from 'react-native-paper';
import {Vibration} from 'react-native'
const Header = (props) => {
  return (
    <View style={styles.header}>
      <Image style={styles.tinyLogo} source={require('assets/logo.png')} />
      <Text style={styles.paragraph}>Focus Streks</Text>
    </View>
  );
};
let runTime = 25 * 60;
let breakTime = 5 * 60;
let intervalId = 0;
export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      timer: runTime,
      isRunning: false,
      breakToggle: true,
      runnerBkp: runTime,
      breakerBkp: breakTime,
      doneSession: 0,
      sessions:4,
    };
  }

  shouldComponentUpdate= (nextProps, nextState)=> {
    if (nextState.timer <= 0) {
      Vibration.vibrate([100])
      if (this.state.breakToggle === true){
        console.log("increment the done session")
        this.setState((prevState) => ({doneSession: prevState.doneSession +1}), ()=>{
        if (this.state.doneSession === this.state.sessions){
          console.log("time to wrap up")
          this.reset()
        }
      })}
    
      this.setState((prevState) => ({
        timer: prevState.breakToggle ? prevState.breakerBkp : prevState.runnerBkp,
        breakToggle: !prevState.breakToggle,
      }));
    }
    return true
  }

  reset(){
    clearInterval(intervalId);
    this.setState({timer: this.state.runnerBkp, breakToggle: true, isRunning: false, doneSession: 0})
    
  }

  startStop() {
    this.setState({ isRunning: !this.state.isRunning });
    this.intervalToggle(!this.state.isRunning);
  }

  intervalToggle(toggle) {
    if (toggle) {
      intervalId = setInterval(this.decrement, 1000);
    } else {
      console.log('Interval reset');
      clearInterval(intervalId);
    }
  }

  decrement = () => {
    this.setState({ timer: this.state.timer - 1 });
    return;
  };
  parse = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return this.concatenate(minutes) + ':' + this.concatenate(seconds);
  };

  concatenate = (value) => {
    return value < 10 ? (value === 0 ? '00' : '0' + value) : value;
  };

  render() {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.config}>
          <Text style={styles.configHeading}>Configure according your ease</Text>
          <TextInput
            placeholder="Focus Length"
            placeholderTextColor="#000"
            style={styles.inputbox}
            ref={(input) => (this.textInput = input)}
            onSubmitEditing={(text) => 
            this.setState({timer: text.nativeEvent.text * 60, runnerBkp: text.nativeEvent.text * 60 }) }
          />
          <TextInput
            placeholder="Short Break Lenght"
            placeholderTextColor="#000"
            style={styles.inputbox}
            // keyboardType="number-pad"
            onSubmitEditing={(text) =>
              this.setState({ breakerBkp: text.nativeEvent.text * 60 }) }
            
          />
          <TextInput
            placeholder="Focus Session"
            placeholderTextColor="#000"
            style={styles.inputbox}
            // keyboardType="number-pad"
            onSubmitEditing={(text) =>
              this.setState({ sessions: text.nativeEvent.text })
            }
          />
        </View>
        <View
          style={this.state.breakToggle ? styles.running : styles.breakTime}>
          <Text style={styles.status}>{this.state.breakToggle ? "Focus" : "Break Time!"}</Text>
          <Text style={styles.timer}>{this.parse(this.state.timer)}</Text>
          <View style={styles.timerBtn}>
            <Button
            color="white"
              title={this.state.isRunning ? 'Stop' : 'Start'}
              onPress={() => this.startStop()}
            />
            <Text style={styles.sessions}>
              {this.state.doneSession}/{this.state.sessions}
            </Text>
            <Button 
            color="white"
            title={'Reset'} onPress={() => this.reset()} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  timer: {
    textAlign: 'center',
    fontSize: 120,
    fontWeight: 'bold',
    position: 'relative',
    marginBottom: 20,
    paddingTop: 10,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    margin: 20,
    position:"relative",
    left:10
  },
  breakTime: {
    height: 390,
    backgroundColor: '#618bc2',
    position: 'relative',
    // top: 10,
  },
  running: {
    height: 390,
    backgroundColor: '#a32210',
    position: 'relative',
    // top: 10,
  },
  sessions: {
    color: '#d49e4e',
    fontSize: 35,
    fontWeight: 'bold',
  },
  inputbox: {
    margin: 5,
    borderWidth: 1,
    borderColor: 'black',
    width: 200,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  configHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    padding: 5,
  },
  status:{
    fontSize: 20,
    position: "relative",
    top: 15,
    color: "#d49e4e",
    fontWeight: "500",
    textAlign: "center",
  },
  config: {
    marginTop: 5,
    // marginLef
    padding: 10,
    height: 200,
    marginBottom: 0,
    alignItems: 'center',
    backgroundColor: '#618bc2',
  },
  container: {
    flex: 1,

    justifyContent: 'top',
    textAlign: 'center',
  },
  header: {
    height: 80,
    flexDirection: 'row',
    
  },
  timerBtn: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  paragraph: {
    marginTop: 40,
    fontSize: 25,
    textAlign:"center",
    fontWeight: 'bold',
    position: "relative",
    left: 30,
    // textAlign: 'center',
  },
});
