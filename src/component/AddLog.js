import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    Button,
    Switch,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useForm, Controller } from "react-hook-form";
import axios, { AxiosError } from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useUserDispatch, useUser } from "../../UserContext";
import moment from "moment";
import theme from '../theme';
import { baseUrl } from '../util';
import SelectOfList from './SelectOfList';
import DatePickerView from './DatePickerView';

const InputTextForm = ({ label, control, controlName, errors }) => {
    const isError = () => errors instanceof Object && errors.message != null;
    return (
        <View>
            <Text style={theme.StyleCommon.label}>{label} <Text style={theme.StyleCommon.textError}>*</Text></Text>
            <Controller
                control={control}
                name={controlName}
                render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                        style={isError() ? theme.StyleCommon.formInputError : theme.StyleCommon.formInput}
                        value={value}
                        onChangeText={value => onChange(value)}
                    />)}
                rules={{
                    required: {
                        value: true,
                        message: `${label} is require!`
                    }
                }}
            />
            {(isError()) ?
                <Text style={theme.StyleCommon.textError}>
                    {errors.message}</Text> : null}</View>);

}

function AddLog({ route, navigation }) {
    const user = useUser();
    const { ticketId } = route.params;
    const { issueKey } = route.params;
    const { control, handleSubmit, setError, setValue, clearErrors, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });
    const configWorkLog = useQuery({
        queryKey: 'configWorkLog',
        queryFn: async () => {
            let response = await axios.get(`${baseUrl}/staff/getconfigWorkLog/`,
                { headers: { token: user.accessToken } });
            return response.data;
        }
    });

    const addWorkLog = useMutation(async data => {
        console.log('url', `${baseUrl}/staff/addWorkLog/${issueKey}`);

        let response = await axios(
            {
                method: `put`,
                url: `${baseUrl}/staff/addWorkLog/${issueKey}`,
                headers:
                {
                    token: user.accessToken
                },
                data: data

            });

        return response.data;

    });

    useEffect(() => {
        if (addWorkLog.isSuccess) navigation.goBack();
    }, [addWorkLog]);
    const onSubmit = data => {

        data.ticket_id = ticketId;
        console.log('create log data ' + JSON.stringify(data));
        addWorkLog.mutate(data);
    };
    return (

        <SafeAreaView style={theme.StyleCommon.container}>

            <ScrollView
                contentInsetAdjustmentBehavior="automatic">
                {configWorkLog.isLoading ? <ActivityIndicator size="large" /> :
                    <View style={theme.StyleDashboard.mainContext}>

                        <View style={theme.StyleCommon.form}>
                            <InputTextForm
                                label={'Comment'}
                                control={control}
                                controlName={'comment'}
                                errors={errors.comment} />

                            <DatePickerView
                                style={{ marginEnd: 5 }}
                                isEnabled={true}
                                control={control}
                                controlName={'startDate'}
                                label={'Start date'}
                                errors={errors.startDate} />

                            <SelectOfList
                                label={'Type of work'}
                                data={configWorkLog.data.typeOfWorks}
                                disabledBtn={false}
                                onSelectedItem={(select) => select}
                                textSelectedShow={(item) => item}
                                control={control}
                                controlName={'typeOfWork'}
                                onChangeValue={(item) => item}
                                errors={errors.typeOfWork}
                            />
                            <SelectOfList
                                label={'Phase work log'}
                                data={configWorkLog.data.phaseOfWorkLogs}
                                onSelectedItem={(select) => select.name}
                                textSelectedShow={(item) => item.name}
                                control={control}
                                controlName={'phaseWorklog'}
                                onChangeValue={(item) => item.id}
                                errors={errors.phaseWorklog}
                            />





                            <Text style={theme.StyleCommon.label}>Time spent <Text style={theme.StyleCommon.textError}>*</Text></Text>
                            <Controller
                                control={control}
                                name="timeSpent"
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <TextInput
                                        style={(errors.timeSpent instanceof Object) ? theme.StyleCommon.formInputError : theme.StyleCommon.formInput}
                                        value={value}
                                        keyboardType="phone-pad"
                                        onChangeText={value => onChange(value)}
                                    />)}
                                rules={{
                                    required: {
                                        value: true,
                                        message: 'Time spent is require!'
                                    }
                                    , pattern: {
                                        value: /[0-9]/,
                                        message: 'Format: [0-9]'
                                    }
                                }
                                }
                            />
                            {(errors.time_spent instanceof Object)
                                ?
                                <Text style={theme.StyleCommon.textError}>
                                    {errors.time_spent.message}</Text> : null}
                            <View style={{ flexDirection: 'row', marginVertical: 15 }}>
                                <Controller
                                    control={control}
                                    name="ot"
                                    defaultValue={0}
                                    render={({ field: { onChange, value, onBlur } }) => (
                                        <Switch
                                            trackColor={{ false: "#e3ebf6", true: "#2c7be5" }}
                                            thumbColor={value === 1 ? "#fff" : "#f4f3f4"}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={() => onChange(value == 1 ? 0 : 1)}
                                            value={value === 1}
                                        />)} />
                                <Text style={{
                                    alignSelf: 'center',
                                    fontWeight: '500',
                                    fontSize: 18,
                                    marginStart: 10
                                }}>
                                    OT
                                </Text>

                            </View>

                            {
                                addWorkLog.isError ?
                                    <Text style={theme.StyleCommon.textError}>
                                        {JSON.stringify(addWorkLog.error)}
                                    </Text>
                                    : null
                            }
                            <TouchableOpacity
                                disabled={addWorkLog.status != 'idle'}
                                onPress={handleSubmit(onSubmit)}>
                                <View
                                    style={addWorkLog.isLoading ? theme.StyleCommon.btnDisabled : theme.StyleCommon.btnSubmit}>
                                    {
                                        addWorkLog.isLoading ?
                                            <ActivityIndicator size="large" color={'#fff'} /> :
                                            <Text style={theme.StyleCommon.btnPrimaryText}>Add log</Text>
                                    }
                                </View>
                            </TouchableOpacity>


                        </View>
                    </View>
                }


            </ScrollView>
        </SafeAreaView >

    );
}

export default AddLog;
