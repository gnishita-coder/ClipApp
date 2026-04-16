import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

const OTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isVerified, setIsVerified] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'OTP'>>();
    const [timer, setTimer] = useState(45);
    const [isActive, setIsActive] = useState(false);

    // ✅ FIX: correct param name + use state
    const { confirmation: initialConfirmation, phone } = route.params;
    const [confirmation, setConfirmation] = useState(initialConfirmation);

    const inputs = useRef<Array<TextInput | null>>([]);

    const handleChange = (text: string, index: number) => {
        if (/^\d*$/.test(text)) {
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);

            if (text && index < 5) {
                inputs.current[index + 1]?.focus();
            }

            const joinedOtp = newOtp.join('');

            if (joinedOtp.length === 6) {
                verifyOtp(joinedOtp);
            }
        }
    };

    const handleBackspace = (key: string, index: number) => {
        if (key === 'Backspace' && otp[index] === '' && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const verifyOtp = async (code: string) => {
        try {
            // ✅ FIX: use correct confirmation object
            await confirmation.confirm(code);

            setIsVerified(true);

        } catch (error) {
            console.log("Invalid OTP:", error);
            Alert.alert("Invalid OTP ❌");
        }
    };

    useEffect(() => {
        let interval;

        if (isActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsActive(false);
        }

        return () => clearInterval(interval);
    }, [isActive, timer]);

    const handleResend = async () => {
        try {
            const newConfirm = await auth().signInWithPhoneNumber(phone);

            setTimer(45);
            setIsActive(true);
            setOtp(['', '', '', '', '', '']);
            inputs.current[0]?.focus();

            // ✅ FIX: update state instead of route params
            setConfirmation(newConfirm);

        } catch (error) {
            Alert.alert("Failed to resend OTP");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {isVerified ? (
                <View style={styles.successContainer}>
                    <LottieView
                        source={require('../lottie/orange.json')}
                        autoPlay
                        loop={false}
                        style={styles.lottie}
                        onAnimationFinish={() => navigation.navigate('CarSelection')}
                    />

                    <Text style={styles.successTitle}>
                        Phone Number Verified
                    </Text>

                    <Text style={styles.successSub}>
                        You will be redirected to the main page{'\n'}
                        in a few moments
                    </Text>
                </View>
            ) : (
                <>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Image
                                source={require('../images/back.png')}
                                style={styles.backIcon}
                            />
                        </TouchableOpacity>

                        <Text style={styles.title}>Phone Verification</Text>

                        <View style={{ width: 32 }} />
                    </View>

                    <Text style={styles.subtitle}>
                        Enter 6 digit verification code sent to your phone number
                    </Text>

                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => { inputs.current[index] = ref; }}
                                style={styles.otpBox}
                                keyboardType="number-pad"
                                maxLength={1}
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                                onKeyPress={({ nativeEvent }) =>
                                    handleBackspace(nativeEvent.key, index)
                                }
                            />
                        ))}
                    </View>

                    <TouchableOpacity onPress={handleResend} disabled={isActive}>
                        <Text style={styles.resend}>
                            {isActive
                                ? `Resend in 0:${timer < 10 ? `0${timer}` : timer}`
                                : 'Resend Code'}
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </SafeAreaView>
    );
};

export default OTP;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2C2C2C',
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    title: {
        color: '#fff',
        fontSize: 19,
        textAlign: 'center',
        marginBottom: 40,
        fontWeight: 'semibold'
    },
    subtitle: {
        color: '#fff',
        fontSize: 22,
        textAlign: 'left',
        marginBottom: 30,
        lineHeight: 22,
        fontWeight: 'semibold',
        marginTop: -10
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 12,
        marginTop: 10
    },
    otpBox: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: '#666',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 18,
        color: '#fff',
    },
    resend: {
        color: '#FE8723',
        textAlign: 'center',
        marginTop: 35,
        fontSize: 14,
        fontWeight: 'semibold'
    },
    backIcon: {
        width: 32,
        height: 32,
        marginBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    successContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop:100
    },
    lottie: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    successTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    successSub: {
        color: '#ccc',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 20,
    },
});