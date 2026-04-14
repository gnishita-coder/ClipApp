import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const OTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isVerified, setIsVerified] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


    const inputs = useRef<Array<TextInput | null>>([]);

    const handleChange = (text: string, index: number) => {
        if (/^\d*$/.test(text)) {
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);

            if (text && index < 5) {
                inputs.current[index + 1]?.focus();
            }

            // ✅ ADD THIS
            const joinedOtp = newOtp.join('');
            if (joinedOtp.length === 6) {
                setTimeout(() => {
                    setIsVerified(true);
                }, 300);
            }
        }
    };

    const handleBackspace = (key: string, index: number) => {
        if (key === 'Backspace' && otp[index] === '' && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    useEffect(() => {
    if (isVerified) {
        const timer = setTimeout(() => {
            navigation.navigate('Home');
        }, 2000); // ⏱️ 2 sec delay (adjust if needed)

        return () => clearTimeout(timer);
    }
}, [isVerified]);


    return (
        <SafeAreaView style={styles.container}>
            {isVerified ? (
                <View style={styles.successContainer}>
                   <LottieView
    source={require('../lottie/orange.json')}
    autoPlay
    loop={false}
    style={styles.lottie}
    onAnimationFinish={() => navigation.navigate('Home')}
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

                        {/* Empty view to balance center alignment */}
                        <View style={{ width: 32 }} />
                    </View>

                    {/* Subtitle */}
                    <Text style={styles.subtitle}>
                        Enter 6 digit verification code sent to your phone number
                    </Text>

                    {/* OTP Boxes */}
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

                    {/* Resend */}
                    <TouchableOpacity>
                        <Text style={styles.resend}>Resend Code</Text>
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
        //justifyContent: 'center',
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