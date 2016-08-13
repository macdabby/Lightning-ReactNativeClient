/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @providesModule LightningUser
 * @flow
 */

import React, { Component } from 'react';
import {
  AsyncStorage,
} from 'react-native';

import {LightningConfig} from './Config';

export class LightningUser {
  static async checkLogin () {
    try {
      var sessionKey = await AsyncStorage.getItem('@LightningStore:session');
      if (sessionKey == null || sessionKey == '') {
        return false;
      }
      var baseUrl = LightningConfig.get('api_url');
      var response = await fetch(baseUrl + '/api/user');
      var status = await response.json();
      return status.logged_in;
    } catch (error) {
      // Error retrieving data
      console.log(error);
      return false;
    }
  }
  
  static async requireLogin() {
    if (await this.checkLogin()) {
      return true;
    } else {
      throw new Exception('Not Logged In');
    }
  }
  
  static async logIn(email, password) {
    var baseUrl = LightningConfig.get('api_url');
    var form = new FormData();
    form.append('email', email);
    form.append('password', password);
    form.append('action', 'login');
    var data = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: form,
    };
    var response = await fetch(baseUrl + '/api/user', data);
    var json = await response.json();
    if (json.status == 'success' && json.cookies.session) {
      await AsyncStorage.setItem('@LightningStore:session', json.cookies.session);
    } else {
      throw new Error(json.errors[0]);
    }
  }
  
  static async logOut() {
    var baseUrl = LightningConfig.get('api_url');
    var form = new FormData();
    form.append('action', 'logout');
    var data = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Cookie': 'session=' + await AsyncStorage.getItem('@LightningStore:session')
      },
      body: form,
    };
    var response = await fetch(baseUrl + '/api/user', data);
    var json = await response.json();
    if (json.status == 'success') {
      await AsyncStorage.setItem('@LightningStore:session', '');
    } else {
      throw new Error(json.errors[0]);
    }
  }
}
