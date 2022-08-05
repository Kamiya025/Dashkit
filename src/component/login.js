import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { useForm, Controller } from "react-hook-form";
import axios, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useUserDispatch, useUser } from "../../UserContext";
import theme from '../theme'
import { baseUrl } from '../util';
import { faLock, faUser, faUserCircle } from '@fortawesome/free-solid-svg-icons';
function Login({ navigation }) {
    const user = useUser();
    const dispatch = useUserDispatch();

    const { control, handleSubmit, watch, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });

    const mutation = useMutation(data => {
        let url = `${baseUrl}/staff/login/`;
        console.log(`url:${url}`)
        return axios({
            method: 'post',
            url: url,
            headers: {},
            data: data,
        })
    }, {});
    const onSubmit = data => {
        console.log(data);
        mutation.mutate(data);

    };

    const [hidePass, setHidePass] = useState(true);

    useEffect(() => {
        if (mutation.isSuccess) {
            dispatch({
                type: 'login',
                data: mutation.data.data
            });
        }
    }, [mutation]);

    
    return (
        <SafeAreaView style={theme.StyleCommon.container}>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={{}}>
                <Image
                    style={{ width: 200, height: 200, margin: 50, alignSelf: 'center' }}
                    source={require('../asset/logo.png')}
                    resizeMode="contain"
                />
                <View style={{ margin: 20 }}>
                    <Text style={theme.StyleCommon.heading}>
                        Sign in
                    </Text>
                    <Text style={theme.StyleCommon.subheading}>
                    </Text>
                    <View style={theme.StyleCommon.form}>
                        <Text style={theme.StyleCommon.label}>
                            <FontAwesomeIcon icon={faUser} /> Username
                        </Text>
                        <Controller
                            control={control}
                            name="username"
                            render={({ field: { onChange, value, onBlur } }) => (
                                <TextInput
                                    style={theme.StyleCommon.formInput}
                                    placeholder='username'
                                    autoComplete='username'
                                    placeholderTextColor={'#d2ddec'}
                                    value={value}
                                    onChangeText={value => onChange(value)}
                                />)}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Username is require!'
                                }
                            }}
                        />
                        <Text style={theme.StyleCommon.label}>
                            <FontAwesomeIcon icon={faLock} /> Password
                        </Text>
                        <Controller
                            control={control}
                            name="password"
                            autoComplete='password'
                            render={({ field: { onChange, value, onBlur } }) => (
                                <TextInput
                                    style={theme.StyleCommon.formInput}
                                    placeholder='Password'
                                    placeholderTextColor={'#d2ddec'}
                                    value={value}
                                    secureTextEntry={hidePass}
                                    onChangeText={value => onChange(value)}
                                />)}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Password is require!'
                                }
                            }}
                        />
                    </View>
                    <Text style={theme.StyleCommon.textError}>
                        {(errors.username != null || errors.password != null)
                            ? 'Username and password is require'
                            : null}
                    </Text>
                    {mutation.isError ?
                        <Text style={theme.StyleCommon.textError}>
                            {mutation.error.response.data.description}</Text>
                        :
                        null}
                    <TouchableOpacity
                        disabled={mutation.isLoading}
                        onPress={handleSubmit(onSubmit)}>
                        <View style={(mutation.isLoading) ? theme.StyleCommon.btnDisabled : theme.StyleCommon.btnSubmit}>
                            {
                                mutation.isLoading ?
                                    <ActivityIndicator size="large" color={'#fff'} /> :
                                    <Text style={theme.StyleCommon.btnPrimaryText}>Sign in</Text>
                            }
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>

    );
}


export default Login;
