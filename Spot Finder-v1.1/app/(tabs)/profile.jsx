import { StyleSheet, Text, View, Image, TouchableOpacity, Switch, Modal, Platform } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import Back from "../../assets/images/Back.svg";
import Dark_back from "../../assets/images/White_back.svg";
import Profiles from "../../assets/images/profile_img2.png";
import ThemeContext from '../../theme/ThemeContext';
import { profile_data } from '../../Data/Data';
import Drop_arrow from "../../assets/images/drop_arrow.svg";
import Logout from "../../assets/images/logout.svg";
import { router } from "expo-router";
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { theme, darkMode, toggleTheme } = useContext(ThemeContext);
  const [userInfo, setUserInfo] = useState({ nom: '', prenom: '', email: '', telephone: '' });

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      const userString = await AsyncStorage.getItem('user');
      const userId = await AsyncStorage.getItem('userId');
      const username = await AsyncStorage.getItem('username');

      if (!userId || !username || !userString) {
        router.replace('login');
        return;
      }

      const user = JSON.parse(userString);
      setUserInfo({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone
      });
    };
    checkAuthAndFetchUser();
  }, []);

  const handleLogout = () => {
    setModalVisible(true);
  };

  const confirmLogout = async () => {
    setModalVisible(false);
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('user');
    router.replace('login');
  };

  const cancelLogout = () => {
    setModalVisible(false);
  };

  const back = () => {
    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.push('home');
    }
  };

  const wallet = () => {
    router.push('(screens)/wallet');
  };

  return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={back}>
            {darkMode ? <Dark_back /> : <Back />}
          </TouchableOpacity>
          <Text style={[styles.heading, { color: theme.color }]}>Profile</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrolls}>
          <View style={styles.column}>
            <View>
              <View style={styles.image_box}>
                <Image source={Profiles} alt='image' style={styles.image} />
              </View>
              <View style={styles.details_row}>
                <View style={styles.profile_details}>
                  <Text style={[styles.name, { color: theme.color }]}>{userInfo.prenom} {userInfo.nom}</Text>
                  <Text style={styles.email}>{userInfo.email}</Text>
                  <Text style={styles.number}>{userInfo.telephone}</Text>
                </View>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.edit}>edit</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.profile_data_container}>
                {profile_data.map((d) => (
                    <TouchableOpacity
                        style={styles.row}
                        key={d.id}
                        onPress={() => {
                          if (d.name === 'Dark Mode') toggleTheme();
                          else if (d.name === 'Wallet') wallet();
                        }}
                    >
                      <View style={styles.row_left}>
                        {darkMode ? d.active_icon : d.icon}
                        <Text style={[styles.row_text, { color: theme.text }]}>{d.name}</Text>
                      </View>
                      {d.name === 'Dark Mode' ? (
                          <Switch
                              trackColor={{ false: "#767577", true: "#FF85A2" }}
                              thumbColor={darkMode ? "#f4f3f4" : "#f4f3f4"}
                              onValueChange={toggleTheme}
                              value={darkMode}
                              style={styles.switch}
                          />
                      ) : (
                          <Drop_arrow />
                      )}
                    </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
              <Logout />
              <Text style={[styles.logout_text, { color: theme.log }]}>log out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={cancelLogout}
        >
          <View style={[styles.modalContainer, { backgroundColor: theme.overlay }]}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Are you sure you want to logout?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.button} onPress={confirmLogout}>
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={cancelLogout}>
                  <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'web' ? 20 : 50,
    paddingHorizontal: 20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  heading: {
    fontSize: 24,
    lineHeight: 34,
    fontFamily: 'Montserrat_700Bold',
    textTransform: 'capitalize',
    position: 'absolute',
    left: Platform.OS === 'web' ? '47%' : '38%',
  },
  image_box: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  image: {
    width: 100,
    height: 100,
  },
  details_row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    marginBottom: 27,
  },
  profile_details: {
    gap: 3,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    textTransform: 'capitalize',
  },
  email: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    color: '#757575',
  },
  number: {
    fontSize: 11,
    fontFamily: 'Roboto_400Regular',
    color: '#757575',
  },
  button: {
    backgroundColor: '#FF85A2',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  edit: {
    fontSize: 12,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  scrolls: {
    flexGrow: 1,
  },
  column: {
    flex: 1,
    justifyContent: 'space-between',
  },
  profile_data_container: {
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row_left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  row_text: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
  },
  switch: {
    width: 20,
    maxHeight: 30,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: '5%',
  },
  logout_text: {
    fontSize: 14,
    fontFamily: 'Montserrat_500Medium',
    textTransform: 'capitalize',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  buttonCancel: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
  },
});