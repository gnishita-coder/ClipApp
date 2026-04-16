import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Animated,
  Easing,
  Alert,
  TextInput
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
// ❌ REMOVED BlurView import
// import { BlurView } from '@react-native-community/blur';
import { RootStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

const DATA = [
  { id: '1', image: require('../images/group.png') },
  { id: '2', image: require('../images/group.png') },
  { id: '3', image: require('../images/group.png') },
  { id: '4', image: require('../images/group.png') },
  { id: '5', image: require('../images/group.png') },
  { id: '6', image: require('../images/group.png') },
  { id: '7', image: require('../images/group.png') },
  { id: '8', image: require('../images/group.png') },
  { id: '9', image: require('../images/group.png') },
  { id: '10', image: require('../images/group.png') },
  { id: '11', image: require('../images/group.png') },
  { id: '12', image: require('../images/group.png') },
];

const ITEM_SIZE = width / 3 - 20;

const CarSelectionScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const cryCat = require('../lottie/CatCrying.json');
  const happyCat = require('../lottie/Catlove.json');

  const [showModal, setShowModal] = useState(false);
  const [lottieSource, setLottieSource] = useState(cryCat);

  const translateY = useRef(new Animated.Value(600)).current;
  const gridScale = useRef(new Animated.Value(1)).current;
  const gridOpacity = useRef(new Animated.Value(1)).current;
  const lottieTranslateY = useRef(new Animated.Value(600)).current;
  const lottieTranslateX = useRef(new Animated.Value(120)).current;
  const lottieScale = useRef(new Animated.Value(1)).current;

  const [searchText, setSearchText] = useState('');
  const hasShownModal = useRef(false);

  const filteredData = DATA.filter(item =>
    item.id.toLowerCase().includes(searchText.toLowerCase())
  );

  const LOTTIE_START_X = 120;
  const LOTTIE_START_Y = 0;
  const LOTTIE_MODAL_Y = 120;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(gridScale, {
        toValue: 0.95,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(gridOpacity, {
        toValue: 0.5,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const openModal = useCallback(() => {
    setLottieSource(happyCat);
    setShowModal(true);

    translateY.setValue(600);
    lottieTranslateX.setValue(LOTTIE_START_X);
    lottieTranslateY.setValue(LOTTIE_START_Y);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1200,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(lottieTranslateX, {
        toValue: 0,
        duration: 1200,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(lottieTranslateY, {
        toValue: LOTTIE_MODAL_Y,
        duration: 1200,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!hasShownModal.current) {
        hasShownModal.current = true;

        const timer = setTimeout(() => {
          openModal();
        }, 300);

        return () => clearTimeout(timer);
      }
    }, [openModal])
  );

  const closeModal = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 600,
        duration: 700,
        easing: Easing.in(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(lottieTranslateX, {
        toValue: LOTTIE_START_X,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(lottieTranslateY, {
        toValue: LOTTIE_START_Y,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowModal(false);
      setLottieSource(cryCat);
      callback && callback();
    });
  };

  const renderItem = ({ item }: { item: { id: string; image: any } }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        navigation.navigate('CarDetail', { car: item });
      }}
    >
      <View style={styles.shadowWrapper}>
        <View style={styles.circle}>
          <View style={styles.innerCircle}>
            <Image source={item.image} style={styles.image} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../images/back.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.title}>Select Your Option</Text>

        <TouchableOpacity onPress={openModal}>
          <LottieView source={lottieSource} autoPlay loop style={styles.lottieIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search car..."
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      <View style={{ flex: 1 }}>
        {/* ❌ Removed BlurView */}

        <Animated.View
          style={{
            transform: [{ scale: gridScale }],
            opacity: showModal ? 0.3 : gridOpacity,
          }}
        >
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={{ padding: 10 }}
          />
        </Animated.View>
      </View>

      <Modal transparent visible={showModal} animationType="none">
        <View style={styles.modalOverlay}>
          <View style={styles.overlay} />

          <Animated.View
            style={[
              styles.glassCard,
              { transform: [{ translateY }] },
            ]}
          >
            <Text style={styles.modalTitle}>Choose Option</Text>

            <TouchableOpacity
              style={styles.glassButton}
              onPress={() => closeModal()}
            >
              <Text style={styles.buttonText}>Select Your Option</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.glassButton}
              onPress={() =>
                closeModal(() => Alert.alert('Scan Coming Soon 📸'))
              }
            >
              <Text style={styles.buttonText}>Scan Your Car</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default CarSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2E2F',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 50,
  },

  backIcon: {
    width: 32,
    height: 32,
  },

  // 🔥 NEW LOTTIE STYLE
  lottieIcon: {
    width: 60,
    height: 60,
    
    
    
  },

  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign:'center',
    
  },

  card: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
  },

  shadowWrapper: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#f87838',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 14,
  },

  circle: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1.5,
    borderColor: 'rgba(56,189,248,0.5)',
  },

  innerCircle: {
    width: '85%',
    height: '85%',
    borderRadius: 100,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#334155',
  },

  image: {
    width: ITEM_SIZE * 0.6,
    height: ITEM_SIZE * 0.6,
    resizeMode: 'contain',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  glassCard: {
    width: '85%',
    padding: 20,
    borderRadius: 20,

    backgroundColor: 'rgba(255,255,255,0.08)',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',

    elevation: 12,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },

  modalTitle: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
    fontWeight: 'bold',
  },

  glassButton: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,

    backgroundColor: 'rgba(255,255,255,0.15)',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  topLottieWrapper: {
  position: 'absolute',
  top: '32%',
  zIndex: 10,
  alignItems: 'center',
  justifyContent: 'center',
},

topLottie: {
  width: 120,
  height: 120,
},
searchContainer: {
  marginHorizontal: 20,
  marginTop: 15,
},

searchInput: {
  backgroundColor: '#1E293B',
  borderRadius: 12,
  paddingHorizontal: 15,
  height: 45,
  color: '#fff',

  borderWidth: 1,
  borderColor: '#334155',
},
});