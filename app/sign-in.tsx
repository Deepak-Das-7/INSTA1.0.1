import { useSession } from '../UserContext';
import React, { useState } from 'react';
import { Alert, StyleSheet, View, StatusBar, Text, TextInput, TouchableOpacity, Pressable, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import Logo from '../components/Logo';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

export default function Auth() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('apple@gmail.com');
    const [password, setPassword] = useState('apple');
    const [password2, setPassword2] = useState('');
    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState('login');
    const [select, setSelect] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isEmailValid2, setIsEmailValid2] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isPasswordValid2, setIsPasswordValid2] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const { userId, setUserId } = useSession();
    const [error, setError] = useState('');

    const handleRegister = () => {
        const userData = {
            username: name,
            email: email,
            password: password,
            profilePicture: "https://picsum.photos/600/300"
        };
        axios.post("http://192.168.31.86:8000/auth/register", userData)
            .then((response) => {
                console.log(response.data.message);
                Alert.alert("Registration Successful", "You have been registered successfully");
                setName("");
                setPassword2("");
                setLogin("login");
            })
            .catch((error) => {
                Alert.alert("Registration Fail", "An error occurred during registration");
                console.log("register failed", error);
            });
    };

    const handleLogin = () => {
        console.log("pressed login");
        setLoading(true);
        const userData = {
            email: email,
            password: password,
        };
        if (!email || !password) {
            Alert.alert("Invalid info", "Fill all fields");
            console.log("Login failed", "Data insufficient");
            setLoading(false);
            return;
        }

        axios.post("http://192.168.31.86:8000/auth/login", userData)
            .then((response) => {
                setUserId(response.data.data);
                setLoading(false);
                console.log(userData);
                router.replace("/");
            })
            .catch((error) => {
                Alert.alert("Login Fail", "An error occurred during Login");
                console.log("Login failed ,Check server is running or not first in cd api npm start", error, error.message, error.response);
                setLoading(false);
            });
    };

    const validateEmail = (text) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(text);
    };

    const selectUser = () => {
        axios.get("http://192.168.31.86:8000/user/allUser")
            .then((response) => {
                setAllUsers(response.data);
            })
            .catch((error) => {
                Alert.alert("Fetching Fail", "An error occurred during Fetching");
                console.log("Fetching failed", error);
            });
    };

    const handleUserPress = (user) => {
        setEmail(user.email);
        setPassword(user.password);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleUserPress(item)} style={{}}>
            <Text style={{ fontSize: 15, fontWeight: '500' }}>{item.username}</Text>
            <Text style={{ fontSize: 10 }}>{item.email}</Text>
        </TouchableOpacity>
    );

    const handleInputChange = (text) => {
        if (text.includes(' ')) {
            setError('Username should not contain spaces');
        } else {
            setName(text);
            setError('');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar backgroundColor="#FFE400" barStyle="dark-content" />
            <View style={styles.container}>
                <View>
                    <Logo />
                    <View style={styles.verticallySpaced}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            onChangeText={(text) => {
                                setEmail(text);
                                setIsEmailValid(text);
                                setIsEmailValid2(validateEmail(text));
                            }}
                            value={email}
                            placeholder="Enter your email"
                            autoCapitalize="none"
                            style={styles.input}
                        />
                        {!isEmailValid ? (
                            <Text style={styles.error}>Email required*</Text>
                        ) : !isEmailValid2 ? (
                            <Text style={styles.error}>Enter a valid email address*</Text>
                        ) : null}
                    </View>
                    <View style={styles.verticallySpaced}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            onChangeText={(text) => {
                                setPassword(text);
                                setIsPasswordValid(text);
                            }}
                            value={password}
                            secureTextEntry={!showPassword}
                            placeholder="Password"
                            autoCapitalize="none"
                            style={styles.input}
                        />
                        {!isPasswordValid ? (
                            <Text style={styles.error}>Password required*</Text>
                        ) : null}
                    </View>
                    {login === "login" ? (
                        <View>
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Text style={{ textAlign: "right", marginVertical: 5 }}>
                                    {showPassword ? (
                                        <FontAwesome name="eye-slash" size={18} color="gray" />
                                    ) : (
                                        <FontAwesome name="eye" size={18} color="black" />
                                    )}
                                </Text>
                            </TouchableOpacity>
                            <View style={[styles.verticallySpaced, { opacity: loading ? 0.5 : 1, marginTop: 10 }]}>
                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={handleLogin}
                                    style={styles.button}
                                >
                                    <Text style={styles.buttonText}>Sign in</Text>
                                </TouchableOpacity>
                            </View>
                            <Pressable onPress={() => setLogin("logout")}>
                                <Text style={styles.txt}>Don't have an account? Sign Up.</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <View>
                            <View style={styles.verticallySpaced}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <TextInput
                                    onChangeText={(text) => {
                                        setPassword2(text);
                                        setIsPasswordValid2(text);
                                    }}
                                    value={password2}
                                    secureTextEntry={!showPassword}
                                    placeholder="Re-enter your Password"
                                    autoCapitalize="none"
                                    style={styles.input}
                                />
                                {!isPasswordValid2 ? (
                                    <Text style={styles.error}>Confirm Password*</Text>
                                ) : password !== password2 ? (
                                    <Text style={styles.error}>Enter the same Password*</Text>
                                ) : null}
                            </View>
                            <View style={styles.verticallySpaced}>
                                <Text style={styles.label}>Username</Text>
                                <TextInput
                                    onChangeText={handleInputChange}
                                    value={name}
                                    placeholder="Enter your Username"
                                    autoCapitalize="none"
                                    style={styles.input}
                                />
                                {name.length < 6 ? (
                                    <Text style={styles.error}>Username should have at least 6 characters</Text>
                                ) : error ? (
                                    <Text style={styles.error}>{error}</Text>
                                ) : null}
                            </View>
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Text style={{ textAlign: "right", marginVertical: 5 }}>
                                    {showPassword ? (
                                        <FontAwesome name="eye-slash" size={18} color="gray" />
                                    ) : (
                                        <FontAwesome name="eye" size={18} color="black" />
                                    )}
                                </Text>
                            </TouchableOpacity>
                            <View style={[styles.verticallySpaced, { opacity: loading ? 0.5 : 1, marginTop: 10 }]}>
                                <TouchableOpacity
                                    disabled={loading}
                                    onPress={() => {
                                        if (password === password2) {
                                            handleRegister();
                                        } else {
                                            Alert.alert("Password Not same", "Enter the same password");
                                        }
                                    }}
                                    style={styles.button}
                                >
                                    <Text style={styles.buttonText}>Sign up</Text>
                                </TouchableOpacity>
                            </View>
                            <Pressable onPress={() => setLogin("login")}>
                                <Text style={styles.txt}>Already have an account? Login.</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
                <TouchableOpacity
                    disabled={select}
                    onPress={selectUser}
                    style={styles.selectUserButton}
                >
                    <Text style={styles.selectUserButtonText}>Select user</Text>
                </TouchableOpacity>
                <View style={{ marginTop: 10 }}>
                    <FlatList
                        data={allUsers}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        padding: 20,
        backgroundColor: "#FFE400",
    },
    verticallySpaced: {
        paddingVertical: 6,
        alignSelf: 'stretch',
    },
    input: {
        borderBottomWidth: 3,
        borderColor: 'gray',
        padding: 5,
        borderRadius: 5,
    },
    txt: {
        color: "blue",
        textAlign: "center",
        marginTop: 15,
        fontWeight: "500",
    },
    label: {
        fontWeight: "500",
        fontSize: 16,
        color: "#FF8300"
    },
    error: {
        color: 'red',
        fontSize: 10
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFAE00',
        padding: 10,
        borderRadius: 5
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: "500"
    },
    selectUserButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FACE58',
        padding: 10,
        borderRadius: 5,
        marginTop: 20
    },
    selectUserButtonText: {
        color: 'green',
        fontSize: 18,
        fontWeight: "500"
    }
});
