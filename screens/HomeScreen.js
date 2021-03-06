import React from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBdHdmZZd0oxAVSC6vFQYK396U8VCHMLmM",
  authDomain: "food-combos.firebaseapp.com",
  databaseURL: "https://food-combos.firebaseio.com/",
  storageBucket: "",
  messagingSenderId: "751896869172"
};

firebase.initializeApp(firebaseConfig);

export default class HomeScreen extends React.Component {
  state = {
    text: '',
    loading: false,
  }


  componentWillMount() {
    let initialLoad = true;
    this.setState({loading: true});

    firebase.database().ref('example').on('value', (snapshot) => {
      this.setState({text: snapshot.val() && snapshot.val().text});

      if (initialLoad) {
        this.setState({loading: false});
        initialLoad = false;
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Store some value in Firebase!
        </Text>

        <TextInput
          onChangeText={text => { this.setState({text}) }}
          onSubmitEditing={this._saveValue}
          value={this.state.text}
          style={styles.textInput}
        />

        <Button
          onPress={this._saveValue}
          title="Save"
        />

        {this._maybeRenderLoadingOverlay()}
      </View>
    );
  }

  _saveValue = async () => {
    try {
      this.setState({loading: true});
      await firebase.database().ref('example').set({ text: this.state.text });
    } catch(e) {
      // Error! oh no
    } finally {
      this.setState({loading: false});
    }
  }

  _maybeRenderLoadingOverlay = () => {
    if (this.state.loading) {
      return (
        <View style={[StyleSheet.absoluteFill, styles.loadingOverlay]}>
          <ActivityIndicator
            color="#fff"
            animating
            size="large"
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
  },
  textInput: {
    width: Dimensions.get('window').width - 30,
    marginHorizontal: 15,
    padding: 5,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#eee',
    marginVertical: 15,
    height: 50,
    fontSize: 16,
  },
  loadingOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
